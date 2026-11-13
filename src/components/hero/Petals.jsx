import styles from './Petals.module.css'

// 서버 프리렌더와 브라우저 결과가 같도록, Math.random 대신 고정 시드 난수를 쓴다
function seeded(seed) {
  let t = seed
  return () => {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function makePetals(count) {
  const rand = seeded(20261114)
  return Array.from({ length: count }, (_, i) => {
    const duration = 14 + rand() * 12 // 14~26초에 한 번 떨어짐
    return {
      id: i,
      style: {
        '--x': `${(i / count) * 100 + rand() * (100 / count)}%`, // 화면 너비에 고르게
        '--size': `${14 + rand() * 16}px`,
        '--drift': `${(rand() - 0.5) * 30}vw`, // 떨어지며 옆으로 흘러가는 거리
        '--spin': `${(rand() > 0.5 ? 1 : -1) * (200 + rand() * 360)}deg`,
        '--duration': `${duration}s`,
        '--delay': `${-rand() * duration}s`, // 음수: 처음부터 화면 곳곳에 흩어진 상태로 시작
        '--sway': `${3 + rand() * 3}s`,
        '--opacity': (0.55 + rand() * 0.35).toFixed(2),
        // 브랜드 색을 흰색에 섞어 부드러운 꽃잎 색으로
        '--tone':
          i % 3 === 0
            ? 'var(--color-secondary)'
            : 'color-mix(in srgb, var(--color-primary) 55%, #fff)',
      },
    }
  })
}

// 히어로 위로 천천히 흩날리는 꽃잎 (CSS 애니메이션만 사용, 동작 줄이기 설정 시 숨김)
export default function Petals({ count = 18 }) {
  const petals = makePetals(count)
  return (
    <div className={styles.layer} aria-hidden="true">
      {petals.map((p) => (
        <span key={p.id} className={styles.fall} style={p.style}>
          <svg className={styles.petal} viewBox="0 0 24 32">
            <path d="M12 1C5 7 1.5 14 3 21c1.3 6 5 10 9 10s7.7-4 9-10C22.5 14 19 7 12 1z" />
            <path d="M12 6v22" className={styles.vein} />
          </svg>
        </span>
      ))}
    </div>
  )
}
