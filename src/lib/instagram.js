// Behold 게시물 → 갤러리 타일 변환

const MAX_ALT = 60
const MIN_LINE = 6 // 첫 줄이 이보다 짧으면("문의" 등) 해시태그로 설명한다

const stripEmoji = (s) => s.replace(/[\p{Extended_Pictographic}️‍]/gu, '').replace(/\s+/g, ' ').trim()
const truncate = (s) => (s.length > MAX_ALT ? `${s.slice(0, MAX_ALT)}…` : s)

// 사진 설명(alt): 게시물 대체 텍스트 → 캡션 첫 줄(해시태그·이모지 제외) → 해시태그 순으로 쓴다
export function postAlt(post) {
  if (post.altText) return post.altText
  const caption = post.prunedCaption || post.caption || ''
  const firstLine = caption
    .split('\n')
    .map((line) => stripEmoji(line.replace(/#\S+/g, ' ')))
    .find(Boolean)
  if (firstLine && firstLine.length >= MIN_LINE) return truncate(firstLine)

  const tags = post.hashtags?.length ? post.hashtags : [...caption.matchAll(/#([^\s#]+)/g)].map((m) => m[1])
  if (tags.length) return truncate(tags.slice(0, 4).join(', '))
  return firstLine || '인스타그램 게시물'
}

// "141,125,129" → "rgb(141 125 129)" (사진이 뜨기 전 자리 색)
const paletteColor = (rgb) => (rgb ? `rgb(${rgb.split(',').join(' ')})` : undefined)

export function postToTile(post) {
  const { small, medium, large } = post.sizes
  const variants = [small, medium, large].filter((s) => s?.mediaUrl)
  return {
    key: post.id,
    href: post.permalink,
    alt: postAlt(post),
    src: (medium ?? small ?? large).mediaUrl,
    srcSet: variants.map((s) => `${s.mediaUrl} ${s.width}w`).join(', '),
    width: (medium ?? small).width,
    height: (medium ?? small).height,
    color: paletteColor(post.colorPalette?.dominant ?? post.colorPalette?.muted),
    type: post.mediaType === 'CAROUSEL_ALBUM' ? 'carousel' : post.mediaType === 'VIDEO' ? 'video' : null,
  }
}
