import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, CanvasTexture } from 'three'

// 가장자리가 흐릿한 동그란 점 텍스처
function createSoftDot() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.5)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new CanvasTexture(canvas)
}

// 구 안에 점을 고르게 흩뿌린다 (조금 뒤로 밀어 오브젝트 뒤 배경처럼 보이게)
function scatterInSphere(count, radius) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random())
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    arr[i * 3 + 2] = r * Math.cos(phi) - 2
  }
  return arr
}

// 배경에 천천히 떠다니는 부드러운 파티클
export default function Particles({ count = 300, color = '#ffffff', radius = 7 }) {
  const ref = useRef()
  const texture = useMemo(() => createSoftDot(), [])
  useEffect(() => () => texture.dispose(), [texture])

  const positions = useMemo(() => scatterInSphere(count, radius), [count, radius])

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.02
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        color={color}
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}
