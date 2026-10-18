import manifest from '../data/image-manifest.json' with { type: 'json' }

// "/images/a.webp" → "/images/a-640.webp" (원본 크기는 접미사 없음)
const variant = (src, w, full) => (w === full ? src : src.replace(/\.webp$/, `-${w}.webp`))

// <img>에 넣을 src/srcset/sizes/width/height를 만든다. (프리렌더·히어로 preload에서도 같이 쓴다)
export function imageAttrs(src, sizes = '100vw') {
  const info = manifest[src]
  if (!info) return { src }
  return {
    src,
    srcSet: info.widths.map((w) => `${variant(src, w, info.width)} ${w}w`).join(', '),
    sizes,
    width: info.width,
    height: info.height,
  }
}

// 원하는 너비 이상인 가장 작은 변환본 주소 (3D 텍스처처럼 srcset을 쓸 수 없는 곳용)
export function imageVariant(src, minWidth) {
  const info = manifest[src]
  if (!info) return { src }
  const w = info.widths.find((x) => x >= minWidth) ?? info.width
  return { src: variant(src, w, info.width), width: info.width, height: info.height }
}

// 히어로 정지 꽃 사진의 화면 너비 (Hero.module.css의 .flower 크기와 맞춘다: 높이 47.5%/76.5% × 가로세로비)
export const HERO_FLOWER_SIZES = '(min-width: 768px) 43vh, 27vh'
