import styles from './Footer.module.css'

const YEAR = new Date().getFullYear()

// 공정거래위원회 사업자정보 확인 페이지 (통신판매업자 정보 공개)
const ftcUrl = (registrationNumber) => {
  const digits = registrationNumber?.replace(/\D/g, '')
  return digits?.length === 10 ? `https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${digits}` : null
}

export default function Footer({ footer, brand, privacy }) {
  const { business } = footer
  const ftc = ftcUrl(business?.registrationNumber)

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <a href="/" className={styles.brand}>
            {brand.name}
          </a>
          {brand.tagline && <p className={styles.tagline}>{brand.tagline}</p>}
        </div>

        <dl className={styles.contact}>
          {footer.address && (
            <div>
              <dt>주소</dt>
              <dd>{footer.address}</dd>
            </div>
          )}
          {footer.phone && (
            <div>
              <dt>전화</dt>
              <dd>
                <a href={`tel:${footer.phone.replace(/[^0-9+]/g, '')}`}>{footer.phone}</a>
              </dd>
            </div>
          )}
          {footer.email && (
            <div>
              <dt>이메일</dt>
              <dd>
                <a href={`mailto:${footer.email}`}>{footer.email}</a>
              </dd>
            </div>
          )}
          {footer.hours && (
            <div>
              <dt>운영시간</dt>
              <dd>{footer.hours}</dd>
            </div>
          )}
        </dl>

        {footer.social?.length > 0 && (
          <ul className={styles.social}>
            {footer.social.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                  <span className="sr-only">(새 창)</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* 전자상거래법상 사업자 정보 표시 */}
        {business && (
          <dl className={styles.business}>
            <div>
              <dt>상호</dt>
              <dd>{brand.name}</dd>
            </div>
            {business.owner && (
              <div>
                <dt>대표자</dt>
                <dd>{business.owner}</dd>
              </div>
            )}
            {business.registrationNumber && (
              <div>
                <dt>사업자등록번호</dt>
                <dd>
                  {business.registrationNumber}
                  {ftc && (
                    <a href={ftc} target="_blank" rel="noopener noreferrer" className={styles.ftc}>
                      사업자정보확인<span className="sr-only">(새 창)</span>
                    </a>
                  )}
                </dd>
              </div>
            )}
            {business.mailOrderNumber && (
              <div>
                <dt>통신판매업신고</dt>
                <dd>{business.mailOrderNumber}</dd>
              </div>
            )}
            {business.hostingProvider && (
              <div>
                <dt>호스팅 제공</dt>
                <dd>{business.hostingProvider}</dd>
              </div>
            )}
          </dl>
        )}

        <div className={styles.bottom}>
          {privacy && (
            <a href="/privacy" className={styles.privacy}>
              {privacy.title}
            </a>
          )}
          <p className={styles.copyright}>
            © {YEAR} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
