import { formatPrice } from '../../lib/format.js'
import ContactButton from '../common/ContactButton.jsx'
import ExternalButton from '../common/ExternalButton.jsx'
import Img from '../common/Img.jsx'
import Reveal from '../common/Reveal.jsx'
import SectionHeader from '../common/SectionHeader.jsx'
import styles from './Products.module.css'

export default function Products({ products, store, contact }) {
  return (
    <section id="products" className={`section ${styles.section}`} aria-labelledby="products-title">
      <div className="container">
        <SectionHeader
          id="products-title"
          eyebrow={products.eyebrow}
          title={products.title}
          description={products.description}
        />

        <ul className={styles.grid}>
          {products.items.map((item, i) => (
            <Reveal as="li" key={item.id} className={styles.card} delay={(i % 4) * 80}>
              <div className={styles.media}>
                <Img src={item.image} alt={item.name} className={styles.image} sizes="(min-width: 768px) 25vw, 50vw" />
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.price}>{formatPrice(item.price)}</p>
                {/* 구매 링크가 있으면 스마트스토어(새 탭), 없으면 문의하기 */}
                {item.url || products.storeUrl ? (
                  <ExternalButton href={item.url || products.storeUrl} block className={styles.button}>
                    {products.buttonLabel}
                  </ExternalButton>
                ) : (
                  <ContactButton contact={contact} block className={styles.button} />
                )}
              </div>
            </Reveal>
          ))}
        </ul>

        {store?.notice && <p className="store-notice">{store.notice}</p>}

        {products.storeUrl && (
          <div className={styles.more}>
            <ExternalButton href={products.storeUrl} variant="outline">
              {products.storeLabel}
            </ExternalButton>
          </div>
        )}
      </div>
    </section>
  )
}
