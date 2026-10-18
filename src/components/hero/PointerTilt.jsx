import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

const AUTO_SPIN = 0.15 // 초당 자동 회전(라디안)
const TILT = 0.45 // 마우스를 끝까지 움직였을 때 기울어지는 최대 각도
const SMOOTH = 2.5 // 클수록 마우스를 빨리 따라간다

// 자식 오브젝트를 마우스 위치 쪽으로 부드럽게 기울인다.
// spin=true면 천천히 자동 회전도 한다 (사진처럼 앞면만 있는 오브젝트는 false).
export default function PointerTilt({ children, spin = true, maxTilt = TILT }) {
  const tilt = useRef()
  const spinRef = useRef()

  useFrame((state, delta) => {
    const { x, y } = state.pointer
    tilt.current.rotation.x = MathUtils.damp(tilt.current.rotation.x, -y * maxTilt, SMOOTH, delta)
    tilt.current.rotation.y = MathUtils.damp(tilt.current.rotation.y, x * maxTilt, SMOOTH, delta)
    if (spin) spinRef.current.rotation.y += delta * AUTO_SPIN
  })

  return (
    <group ref={tilt}>
      <group ref={spinRef}>{children}</group>
    </group>
  )
}
