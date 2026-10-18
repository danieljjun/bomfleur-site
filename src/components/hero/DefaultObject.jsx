// 3D 모델 파일이 없을 때 보여주는 기본 오브젝트 (TorusKnot)
export default function DefaultObject({ color, detail = 'high' }) {
  const segments = detail === 'high' ? [220, 32] : [120, 16]
  return (
    <mesh>
      <torusKnotGeometry args={[1, 0.34, ...segments]} />
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.15} />
    </mesh>
  )
}
