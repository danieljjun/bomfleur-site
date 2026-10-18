import { formatPrice } from '../../lib/format.js'
import ContactButton from '../common/ContactButton.jsx'
import ExternalButton from '../common/ExternalButton.jsx'
import Reveal from '../common/Reveal.jsx'
import SectionHeader from '../common/SectionHeader.jsx'
import styles from './Education.module.css'

export default function Education({ education, store, contact }) {
  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <div className="container">
        <SectionHeader
          id="education-title"
          eyebrow={education.eyebrow}
          title={education.title}
          description={education.description}
        />

        <ul className={styles.grid}>
          {education.items.map((item, i) => {
            // 클래스별 환불규정이 없으면 공통 규정을 쓴다
            const refundPolicy = item.refundPolicy ?? education.refundPolicy ?? []
            return (
              <Reveal as="li" key={item.id} className={styles.card} delay={(i % 3) * 80}>
                <h3 className={styles.name}>{item.name}</h3>
                {item.description && <p className={styles.desc}>{item.description}</p>}

                <dl className={styles.meta}>
                  <div>
                    <dt>일정</dt>
                    <dd>{item.schedule}</dd>
                  </div>
                  {item.duration && (
                    <div>
                      <dt>소요시간</dt>
                      <dd>{item.duration}</dd>
                    </div>
                  )}
                  <div>
                    <dt>정원</dt>
                    <dd>{item.capacity}명</dd>
                  </div>
                  <div>
                    <dt>가격</dt>
                    <dd className={styles.price}>{formatPrice(item.price)}</dd>
                  </div>
                </dl>

                {refundPolicy.length > 0 && (
                  <details className={styles.refund}>
                    <summary>환불규정</summary>
                    <ul>
                      {refundPolicy.map((rule) => (
                        <li key={rule}>{rule}</li>
                      ))}
                    </ul>
                  </details>
                )}

                {/* 신청 링크가 있으면 스마트스토어(새 탭), 없으면 문의하기 */}
                {item.applyUrl || education.storeUrl ? (
                  <ExternalButton href={item.applyUrl || education.storeUrl} block className={styles.button}>
                    {education.buttonLabel}
                  </ExternalButton>
                ) : (
                  <ContactButton contact={contact} block className={styles.button} />
                )}
              </Reveal>
            )
          })}
        </ul>

        {store?.notice && <p className="store-notice">{store.notice}</p>}
      </div>
    </section>
  )
}
