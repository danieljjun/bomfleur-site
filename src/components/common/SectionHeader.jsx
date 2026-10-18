import Reveal from './Reveal.jsx'
import styles from './SectionHeader.module.css'

export default function SectionHeader({ id, eyebrow, title, description, align = 'center' }) {
  return (
    <Reveal className={`${styles.header} ${styles[align]}`}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 id={id} className={`${styles.title} pre-line`}>
        {title}
      </h2>
      {description && <p className={styles.description}>{description}</p>}
    </Reveal>
  )
}
