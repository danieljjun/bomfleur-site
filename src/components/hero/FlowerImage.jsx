import { useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import { DoubleSide, SRGBColorSpace } from 'three'
import { imageVariant } from '../../lib/images.js'

// 사진 색이 바래지 않도록 sRGB로 읽는다
const setupTexture = (texture) => {
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
}

/**
 * 배경을 오려낸 사진(투명 webp)을 3D 공간의 평면에 붙여 보여준다. (client.json의 hero.flowerImage)
 * 앞면만 있는 사진이므로 회전시키지 않고 기울기·둥실 효과만 준다 (Hero3D).
 */
export default function FlowerImage({ src, height = 3.8, textureWidth = 800, onReady }) {
  const image = imageVariant(src, textureWidth)
  const texture = useTexture(image.src, setupTexture)

  // 사진을 다 받은 뒤에 알린다 (히어로가 배경 사진을 흐리게 바꿈)
  useEffect(() => {
    onReady?.()
  }, [onReady])

  const aspect = image.width && image.height ? image.width / image.height : 1
  return (
    <mesh>
      <planeGeometry args={[height * aspect, height]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.02} side={DoubleSide} toneMapped={false} />
    </mesh>
  )
}
