import feed from '../../data/instagram-feed.json'
import ExternalButton from '../common/ExternalButton.jsx'
import Img from '../common/Img.jsx'
import SectionHeader from '../common/SectionHeader.jsx'
import styles from './Portfolio.module.css'

const SIZES = '(min-width: 1024px) 370px, 33vw' // 모든 화면에서 3열

/**
 * 인스타그램 피드 갤러리 (portfolio 섹션).
 * - 피드는 빌드할 때 scripts/fetch-instagram.mjs가 받아 둔 src/data/instagram-feed.json을 쓴다.
 *   (방문자 브라우저는 Behold에 피드를 요청하지 않는다. 사진만 Behold 이미지 서버에서 받는다.)
 * - 표시 개수는 portfolio.galleryCount (기본 6 = 3열 × 2행).
 * - 저장된 피드가 없으면 portfolio.items 이미지로 대체하고, 누르면 인스타 프로필로 이동한다.
 */
export default function Portfolio({ portfolio }) {
  const { instagram = {}, galleryCount = 6 } = portfolio

  const fallbackTiles = portfolio.items.map((item) => ({
    key: item.id,
    href: instagram.profileUrl,
    alt: item.title,
    localImage: item.image,
  }))
  const tiles = (feed.tiles?.length ? feed.tiles : fallbackTiles).slice(0, Math.max(1, galleryCount))

  return (
    <section id="portfolio" className="section" aria-labelledby="portfolio-title">
      <div className="container">
        <SectionHeader
          id="portfolio-title"
          eyebrow={portfolio.eyebrow}
          title={portfolio.title}
          description={portfolio.description}
        />

        <div className={styles.wrap}>
          <ul className={styles.grid}>
            {tiles.map((tile) => (
              <li key={tile.key}>
                <Tile tile={tile} />
              </li>
            ))}
          </ul>
        </div>

        {instagram.profileUrl && (
          <div className={styles.more}>
            <ExternalButton href={instagram.profileUrl} variant="outline">
              {instagram.moreLabel}
            </ExternalButton>
          </div>
        )}
      </div>
    </section>
  )
}

function Tile({ tile }) {
  const content = (
    <>
      {tile.localImage ? (
        <Img src={tile.localImage} alt={tile.alt} sizes={SIZES} className={styles.photo} />
      ) : (
        <img
          src={tile.src}
          srcSet={tile.srcSet}
          sizes={SIZES}
          width={tile.width}
          height={tile.height}
          alt={tile.alt}
          loading="lazy"
          decoding="async"
          className={styles.photo}
        />
      )}
      {tile.type && <MediaIcon type={tile.type} />}
    </>
  )

  if (!tile.href) return <span className={styles.tile}>{content}</span>

  return (
    <a
      href={tile.href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.tile}
      style={tile.color ? { '--tile-color': tile.color } : undefined}
    >
      {content}
      <span className="sr-only">(인스타그램, 새 창)</span>
    </a>
  )
}

function MediaIcon({ type }) {
  return (
    <svg className={styles.badge} viewBox="0 0 24 24" aria-hidden="true">
      {type === 'video' ? (
        <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
      ) : (
        <>
          <rect x="7" y="3" width="14" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M17 21H6a3 3 0 0 1-3-3V7" fill="none" stroke="currentColor" strokeWidth="2" />
        </>
      )}
    </svg>
  )
}
