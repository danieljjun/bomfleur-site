import ExternalButton from './ExternalButton.jsx'

// 구매·신청 링크가 없을 때 대신 보여주는 "문의하기" 버튼.
// contact = { label, url, phone }: url(카카오톡 채널 등)이 있으면 새 탭으로, 없으면 전화 걸기로 연결한다.
export default function ContactButton({ contact, block = false, className = '' }) {
  if (contact?.url) {
    return (
      <ExternalButton href={contact.url} variant="outline" block={block} className={className}>
        {contact.label}
      </ExternalButton>
    )
  }

  if (contact?.phone) {
    return (
      <a
        href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
        className={`btn btn--outline ${block ? 'btn--block' : ''} ${className}`}
      >
        {contact.label}
      </a>
    )
  }

  return null
}
