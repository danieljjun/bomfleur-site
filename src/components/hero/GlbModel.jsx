import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'

const TARGET_SIZE = 2.8 // 가장 긴 변을 이 크기로 맞춘다 (기본 오브젝트와 비슷한 크기)

// glb 모델을 불러와 원점 중앙에 두고 크기를 맞춘다. 모델마다 크기·위치가 달라도 같은 자리에 보인다.
export default function GlbModel({ url }) {
  const { scene } = useGLTF(url)

  const { object, scale } = useMemo(() => {
    const object = scene.clone(true)
    const box = new Box3().setFromObject(object)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    object.position.sub(center)
    const longest = Math.max(size.x, size.y, size.z) || 1
    return { object, scale: TARGET_SIZE / longest }
  }, [scene])

  return (
    <group scale={scale}>
      <primitive object={object} />
    </group>
  )
}
