// 이미지 최적화 스크립트: npm run images
//
// images-src/ 의 원본(jpg/png/webp)을 읽어 public/images/ 에 webp로 변환한다.
//   이름-320.webp … 이름-960.webp, 이름.webp(원본 크기, 최대 1600px)
// 각 이미지의 크기 정보는 src/data/image-manifest.json 에 기록되고,
// Img 컴포넌트가 이를 읽어 srcset/width/height를 자동으로 붙인다.
// 또한 client.json의 meta.ogSource 이미지로 공유 미리보기용 public/og.jpg(1200×630)를 만든다.
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'images-src'
const OUT = 'public/images'
const MANIFEST = 'src/data/image-manifest.json'
const WIDTHS = [320, 480, 640, 800, 960] // 원본 너비의 85% 이상인 크기는 원본과 차이가 작아 건너뛴다
const MAX_WIDTH = 1600
const QUALITY = 72

const client = JSON.parse(await readFile('src/data/client.json', 'utf-8'))
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))

await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })

const manifest = {}
for (const file of files) {
  const name = path.parse(file).name
  const input = sharp(path.join(SRC, file)).rotate() // EXIF 회전 반영
  const { width: origWidth } = await input.metadata()
  const fullWidth = Math.min(origWidth, MAX_WIDTH)

  const full = await input.clone().resize({ width: fullWidth }).webp({ quality: QUALITY, effort: 5 }).toFile(path.join(OUT, `${name}.webp`))
  const widths = []
  for (const w of WIDTHS.filter((w) => w < fullWidth * 0.85)) {
    await input.clone().resize({ width: w }).webp({ quality: QUALITY, effort: 5 }).toFile(path.join(OUT, `${name}-${w}.webp`))
    widths.push(w)
  }
  widths.push(fullWidth)

  manifest[`/images/${name}.webp`] = { width: full.width, height: full.height, widths }
  console.log(`✓ ${file} → ${widths.join(', ')}px`)
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')

// 공유 미리보기 이미지 (카카오톡 등 호환성을 위해 JPG)
const ogSource = files.find((f) => path.parse(f).name === client.meta.ogSource)
if (ogSource) {
  await sharp(path.join(SRC, ogSource))
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile('public/og.jpg')
  console.log(`✓ ${ogSource} → public/og.jpg (1200×630)`)
} else {
  console.warn(`! meta.ogSource("${client.meta.ogSource}")에 해당하는 원본이 images-src에 없습니다.`)
}

// 파비콘·홈 화면 아이콘: 브랜드 색으로 그린 꽃잎 모양 (업체 로고가 있으면 이 파일들을 교체)
const { primary, background } = client.brand.colors
const petals = Array.from({ length: 5 }, (_, i) => `<ellipse cx="32" cy="19" rx="8" ry="13" transform="rotate(${i * 72} 32 32)"/>`).join('')
const icon = (bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${bg ? `<rect width="64" height="64" fill="${bg}"/>` : ''}` +
  `<g fill="${primary}" opacity="0.9">${petals}</g><circle cx="32" cy="32" r="6" fill="${bg || '#fff'}"/></svg>`
await writeFile('public/favicon.svg', icon(null) + '\n')
await sharp(Buffer.from(icon(background))).resize(180, 180).png().toFile('public/apple-touch-icon.png')
console.log('✓ public/favicon.svg, public/apple-touch-icon.png')
