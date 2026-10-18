import { useState } from 'react'
import { imageAttrs } from '../../lib/images.js'
import styles from './Img.module.css'

// webp 이미지 + lazy loading. `npm run images`로 만든 크기별 파일이 있으면 srcset으로 골라 받는다.
// sizes에는 화면에서 이 이미지가 차지하는 폭을 적는다 (예: "(min-width: 768px) 33vw, 50vw").
// 파일이 없거나 깨지면 색 박스로 대체해 레이아웃이 무너지지 않게 한다.
export default function Img({ src, alt = '', className = '', eager = false, sizes = '100vw', ...rest }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <div className={`${styles.placeholder} ${className}`} role="img" aria-label={alt} />
  }

  return (
    <img
      {...imageAttrs(src, sizes)}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      {...rest}
    />
  )
}
