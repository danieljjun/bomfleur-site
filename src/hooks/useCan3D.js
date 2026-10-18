import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './useMediaQuery.js'

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function isCapableDevice() {
  const cores = navigator.hardwareConcurrency ?? 8
  const memory = navigator.deviceMemory ?? 8 // Chrome 계열만 제공
  const lowEnd = cores <= 4 || memory <= 4
  return !lowEnd && supportsWebGL()
}

const START_EVENTS = ['pointerdown', 'pointermove', 'touchstart', 'scroll', 'keydown']
const IDLE_DELAY = 2500 // 페이지 로드 후 이만큼 지나면 상호작용이 없어도 시작

// 3D를 띄워도 되는 환경인지 판단하고, 첫 화면이 다 그려진 뒤에야 true가 된다.
// - 저사양·동작 줄이기·WebGL 미지원이면 계속 false (히어로는 정지 이미지만)
// - 그 외에는 첫 상호작용(스크롤·터치·마우스 이동) 또는 로드 후 IDLE_DELAY 중 먼저 오는 시점에 true
// 서버 프리렌더 결과와 맞추기 위해 처음 값은 항상 false다.
// 실행 중 프레임 저하는 Hero3D 안의 PerformanceMonitor가 따로 감지한다.
export function useCan3D() {
  const reducedMotion = usePrefersReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reducedMotion || !isCapableDevice()) return

    let timer
    const start = () => {
      cleanup()
      setReady(true)
    }
    const startLater = () => {
      timer = setTimeout(() => {
        if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1000 })
        else start()
      }, IDLE_DELAY)
    }
    const cleanup = () => {
      clearTimeout(timer)
      window.removeEventListener('load', startLater)
      START_EVENTS.forEach((e) => window.removeEventListener(e, start))
    }

    START_EVENTS.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }))
    if (document.readyState === 'complete') startLater()
    else window.addEventListener('load', startLater, { once: true })

    return cleanup
  }, [reducedMotion])

  return ready && !reducedMotion
}
