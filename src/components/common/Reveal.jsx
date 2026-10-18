import { useInView } from '../../hooks/useInView.js'

// 스크롤해서 화면에 들어오면 서서히 나타난다. (동작 줄이기 설정 시 global.css에서 효과 제거)
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const [ref, inView] = useInView({ once: true })
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
