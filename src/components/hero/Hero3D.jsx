import { Component, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, PerformanceMonitor } from '@react-three/drei'
import { useIsMobile } from '../../hooks/useMediaQuery.js'
import DefaultObject from './DefaultObject.jsx'
import FlowerImage from './FlowerImage.jsx'
import GlbModel from './GlbModel.jsx'
import Particles from './Particles.jsx'
import PointerTilt from './PointerTilt.jsx'

// glb·이미지 로드에 실패하면 fallback으로 대체한다.
class ModelBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.warn('[Hero3D] 3D 모델·이미지를 불러오지 못했습니다.', error)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * 메인 히어로 3D 장면.
 * - 보여줄 오브젝트 우선순위: modelUrl(hero.model, glb) → flowerImage(hero.flowerImage, 투명 배경 사진) → 기본 오브젝트.
 * - 사진은 앞면만 있으므로 회전 없이 마우스 쪽 기울기(±20°)와 둥실 효과만 준다.
 * - active=false(화면 밖)면 렌더링을 멈춘다.
 * - 프레임이 계속 떨어지면 onFallback을 호출해 정지 이미지로 전환한다.
 */
export default function Hero3D({ modelUrl, flowerImage, colors, eventSource, active = true, onFallback, onReady }) {
  const isMobile = useIsMobile()
  const [dpr, setDpr] = useState(1.5)

  const fallbackObject = <DefaultObject color={colors.primary} detail={isMobile ? 'low' : 'high'} />

  return (
    <Canvas
      dpr={[1, dpr]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'low-power' }}
      frameloop={active ? 'always' : 'never'}
      eventSource={eventSource}
      eventPrefix="client"
    >
      <PerformanceMonitor flipflops={3} onDecline={() => setDpr(1)} onFallback={onFallback} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color={colors.accent} />

      {modelUrl ? (
        <group position={isMobile ? [0, 1.15, 0] : [1.6, 0, 0]} scale={isMobile ? 0.58 : 1}>
          <PointerTilt>
            <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
              <ModelBoundary fallback={fallbackObject}>
                <Suspense fallback={fallbackObject}>
                  <GlbModel url={modelUrl} />
                </Suspense>
              </ModelBoundary>
            </Float>
          </PointerTilt>
        </group>
      ) : flowerImage ? (
        <group position={isMobile ? [0.55, 0.85, 0] : [1.7, -0.1, 0]} scale={isMobile ? 0.62 : 1}>
          <PointerTilt spin={false} maxTilt={0.35}>
            <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
              {/* 사진을 받는 동안·실패 시에는 아무것도 그리지 않는다 (뒤의 정지 이미지가 보임) */}
              <ModelBoundary fallback={null}>
                <Suspense fallback={null}>
                  <FlowerImage src={flowerImage} textureWidth={isMobile ? 640 : 800} onReady={onReady} />
                </Suspense>
              </ModelBoundary>
            </Float>
          </PointerTilt>
        </group>
      ) : (
        <group position={isMobile ? [0, 1.15, 0] : [1.6, 0, 0]} scale={isMobile ? 0.58 : 1}>
          <PointerTilt>
            <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
              {fallbackObject}
            </Float>
          </PointerTilt>
        </group>
      )}

      <Particles count={isMobile ? 150 : 300} color={colors.accent} />
    </Canvas>
  )
}
