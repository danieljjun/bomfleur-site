import client from '../data/client.json'
import Header from '../components/common/Header.jsx'
import Footer from '../components/sections/Footer.jsx'
import styles from './PrivacyPage.module.css'

// 개인정보처리방침 페이지 (/privacy, 파일은 privacy.html). 내용은 모두 client.json의 privacy에서 읽는다.
export default function PrivacyPage() {
  const { brand, store, quoteForm, footer, privacy } = client
  const { officer } = privacy
  const nav = quoteForm ? [{ label: quoteForm.navLabel, href: '/#quote' }] : []

  return (
    <>
      <Header brand={brand} store={store} nav={nav} />

      <main className={`container ${styles.main}`}>
        <h1 className={styles.title}>{privacy.title}</h1>
        <p className={styles.date}>시행일: {privacy.effectiveDate}</p>

        {privacy.sections.map((section) => (
          <section key={section.title} className={styles.section}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {section.items?.length > 0 && (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {officer && (
          <section className={styles.section}>
            <h2>개인정보 보호책임자</h2>
            <dl className={styles.officer}>
              <div>
                <dt>성명</dt>
                <dd>
                  {officer.name}
                  {officer.position && ` (${officer.position})`}
                </dd>
              </div>
              {officer.phone && (
                <div>
                  <dt>연락처</dt>
                  <dd>
                    <a href={`tel:${officer.phone.replace(/[^0-9+]/g, '')}`}>{officer.phone}</a>
                  </dd>
                </div>
              )}
              {officer.email && (
                <div>
                  <dt>이메일</dt>
                  <dd>
                    <a href={`mailto:${officer.email}`}>{officer.email}</a>
                  </dd>
                </div>
              )}
            </dl>
          </section>
        )}

        <section className={styles.section}>
          <h2>개인정보처리방침의 변경</h2>
          <p>이 개인정보처리방침은 {privacy.effectiveDate}부터 적용됩니다.</p>
        </section>
      </main>

      <Footer footer={footer} brand={brand} privacy={privacy} />
    </>
  )
}
