import { useScrolled } from '../../hooks/useScrolled.js'
import ExternalButton from './ExternalButton.jsx'
import styles from './Header.module.css'

/**
 * 사이트 상단 헤더: 왼쪽 상호, 오른쪽 메뉴(nav) + "스토어 바로가기"(store.homeUrl, 새 탭).
 * nav = [{ label, href }] — 같은 페이지의 섹션(#quote 등)은 부드럽게 스크롤된다 (global.css scroll-behavior).
 * overlay=true(메인 페이지)면 히어로 위에 투명하게 떠 있다가 스크롤하면 배경이 깔린다.
 */
export default function Header({ brand, store, nav = [], overlay = false }) {
  const scrolled = useScrolled()
  const solid = !overlay || scrolled

  return (
    <header className={`${styles.header} ${overlay ? styles.overlay : ''} ${solid ? styles.solid : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a href="/" className={styles.brand}>
          {brand.name}
        </a>
        <div className={styles.right}>
          {nav.length > 0 && (
            <nav aria-label="주요 메뉴">
              <ul className={styles.nav}>
                {nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={styles.navLink}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {store?.homeUrl && (
            <ExternalButton href={store.homeUrl} className={styles.store}>
              {store.headerLabel}
            </ExternalButton>
          )}
        </div>
      </div>
    </header>
  )
}
