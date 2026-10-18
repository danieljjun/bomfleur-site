// 스마트스토어 등 외부 링크 버튼. 항상 새 탭으로 연다.
// href가 비어 있으면 누를 수 없는 "준비 중" 상태로 보여준다.
export default function ExternalButton({ href, children, variant = 'primary', block = false, className = '' }) {
  const classes = `btn btn--${variant} ${block ? 'btn--block' : ''} ${className}`

  if (!href) {
    return (
      <span className={`${classes} btn--disabled`} aria-disabled="true">
        준비 중
      </span>
    )
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {children}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
      <span className="sr-only">(새 창)</span>
    </a>
  )
}
