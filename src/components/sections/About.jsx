import Img from '../common/Img.jsx'
import Reveal from '../common/Reveal.jsx'
import SectionHeader from '../common/SectionHeader.jsx'
import styles from './About.module.css'

export default function About({ about }) {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className={`container ${styles.layout}`}>
        <Reveal className={styles.media}>
          <Img src={about.image} alt={about.imageAlt ?? ''} className={styles.image} sizes="(min-width: 768px) 45vw, 100vw" />
        </Reveal>

        <div className={styles.body}>
          <SectionHeader id="about-title" eyebrow={about.eyebrow} title={about.title} align="left" />
          <Reveal className={styles.text} delay={100}>
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>

          {about.highlights?.length > 0 && (
            <Reveal as="dl" className={styles.highlights} delay={200}>
              {about.highlights.map((h) => (
                <div key={h.label} className={styles.highlight}>
                  <dt className={styles.label}>{h.label}</dt>
                  <dd className={styles.value}>{h.value}</dd>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
