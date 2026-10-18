import ExternalButton from '../common/ExternalButton.jsx'
import Reveal from '../common/Reveal.jsx'
import styles from './QuoteCard.module.css'

/**
 * 견적 문의 카드 (상품·교육 섹션 아래, 헤더 메뉴 "견적 문의"의 이동 위치 #quote).
 * - quoteForm.url(구글 설문지 등)을 새 탭으로 연다.
 * - url이 비어 있으면 버튼 대신 전화·카카오톡 채널 안내를 보여준다.
 * contact = { url: 카카오톡 채널, phone: 문의 전화 }
 */
export default function QuoteCard({ quoteForm, contact }) {
  const { url, eyebrow, title, description, buttonLabel, steps = [], notice, fallbackText } = quoteForm
  const phoneHref = contact?.phone ? `tel:${contact.phone.replace(/[^0-9+]/g, '')}` : null

  return (
    <section id="quote" className="section" aria-labelledby="quote-title">
      <div className="container">
        <Reveal className={styles.card}>
          <div className={styles.body}>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            <h2 id="quote-title" className={styles.title}>
              {title}
            </h2>
            {description && <p className={styles.description}>{description}</p>}

            {steps.length > 0 && (
              <ol className={styles.steps}>
                {steps.map((step, i) => (
                  <li key={step}>
                    <span className={styles.stepNo} aria-hidden="true">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className={styles.actions}>
            {url ? (
              <ExternalButton href={url} block className={styles.button}>
                {buttonLabel}
              </ExternalButton>
            ) : (
              <>
                {fallbackText && <p className={styles.fallback}>{fallbackText}</p>}
                {phoneHref && (
                  <a href={phoneHref} className={`btn btn--primary btn--block ${styles.button}`}>
                    {quoteForm.phoneLabel} {contact.phone}
                  </a>
                )}
                {contact?.url && (
                  <ExternalButton href={contact.url} variant="outline" block className={styles.button}>
                    {quoteForm.kakaoLabel}
                  </ExternalButton>
                )}
              </>
            )}
          </div>
        </Reveal>

        {url && notice && <p className={styles.notice}>{notice}</p>}
      </div>
    </section>
  )
}
