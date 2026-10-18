import { useSyncExternalStore } from 'react'

// 페이지가 offset(px) 이상 스크롤됐는지. 서버 프리렌더와 첫 렌더에서는 false.
export function useScrolled(offset = 8) {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener('scroll', onChange, { passive: true })
      return () => window.removeEventListener('scroll', onChange)
    },
    () => window.scrollY > offset,
    () => false,
  )
}
