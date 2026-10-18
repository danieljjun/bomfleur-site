// 폰트 서브셋 스크립트 (npm run build 때 자동 실행, 단독 실행: npm run fonts)
//
// Pretendard 전체 폰트(약 2MB) 대신, 사이트에 실제로 쓰인 글자만 담은 woff2 하나를 만든다.
// 글자 수집 대상: client.json 전체 + src/ 아래 컴포넌트(.jsx/.js)의 문자열 + 기본 영문·숫자·기호.
// client.json 내용을 바꾸면 다시 빌드해야 새 글자가 폰트에 들어간다.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import subsetFont from 'subset-font'

const FONT = 'node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2'
const OUT = 'public/fonts/pretendard-subset.woff2'

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? collectFiles(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  )
  // instagram-feed.json의 사진 설명(alt)은 화면에 글자로 그려지지 않으므로 제외
  return files.flat().filter((f) => /\.(jsx?|json)$/.test(f) && !f.endsWith('instagram-feed.json'))
}

let text = ''
for (let c = 0x20; c < 0x7f; c++) text += String.fromCharCode(c) // 영문·숫자·기호
text += '·–—…‘’“”←→↗©×%₩'
for (const file of await collectFiles('src')) text += await readFile(file, 'utf-8')

const chars = [...new Set(text)].filter((ch) => ch.codePointAt(0) >= 0x20).join('')
const font = await readFile(FONT)
// 굵기 축은 사이트에서 쓰는 400~800 범위만 남긴다 (CSS에서 이 범위를 벗어난 굵기는 가장 가까운 값으로 표시)
const subset = await subsetFont(font, chars, { targetFormat: 'woff2', variationAxes: { wght: { min: 400, max: 800 } } })

await mkdir(path.dirname(OUT), { recursive: true })
await writeFile(OUT, subset)
console.log(`✓ ${OUT}: ${[...chars].length}자, ${(subset.length / 1024).toFixed(1)}KB (원본 ${(font.length / 1024).toFixed(0)}KB)`)
