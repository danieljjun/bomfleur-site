import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { useCan3D } from '../../hooks/useCan3D.js'
import { useInView } from '../../hooks/useInView.js'
import { HERO_FLOWER_SIZES } from '../../lib/images.js'
import Img from '../common/Img.jsx'
import styles from './Hero.module.css'

// three.js 번들은 따로, 첫 화면이 그려진 뒤에 불러온다(useCan3D). 그동안 정지 이미지가 보인다.
const Hero3D = lazy(() => import('./Hero3D.jsx'))

export default function Hero({ hero, brand }) {
  const sectionRef = useRef(null)
  const [visibleRef, inView] = useInView({ threshold: 0 })
  const can3D = useCan3D()
  const [fellBack, setFellBack] = useState(false)
  const [flowerReady, setFlowerReady] = useState(false)
  const onFlowerReady = useCallback(() => setFlowerReady(true), [])
  // hero.enable3D가 false면 3D를 쓰지 않는다 (three.js 코드도 내려받지 않음)
  const show3D = hero.enable3D !== false && can3D && !fellBack
  // 꽃 사진이 있으면: 배경 사진은 옅게 깔고, 정지 꽃 사진을 보여주다가 3D 꽃이 준비되면 넘겨준다
  const hasFlower = Boolean(hero.flowerImage) && !hero.model

  const setRefs = (el) => {
    sectionRef.current = el
    visibleRef.current = el
  }

  return (
    <section ref={setRefs} className={styles.hero} aria-labelledby="hero-title">
      <div className={`${styles.visual} ${hasFlower ? styles.dimmed : ''}`} aria-hidden="true">
        <Img
          src={hero.fallbackImage}
          alt=""
          eager
          sizes={hasFlower ? '30vw' : '100vw'} // 옅고 흐리게 깔리면 작은 파일로 충분
          className={styles.fallback}
          fetchPriority={hasFlower ? 'auto' : 'high'}
        />
        {hasFlower && (
          <Img
            src={hero.flowerImage}
            alt=""
            eager
            sizes={HERO_FLOWER_SIZES}
            fetchPriority="high"
            className={`${styles.flower} ${show3D && flowerReady ? styles.flowerHidden : ''}`}
          />
        )}
        {show3D && (
          <Suspense fallback={null}>
            <Hero3D
              modelUrl={hero.model}
              flowerImage={hero.flowerImage}
              colors={brand.colors}
              eventSource={sectionRef}
              active={inView}
              onFallback={() => setFellBack(true)}
              onReady={onFlowerReady}
            />
          </Suspense>
        )}
      </div>

      <div className={`container ${styles.content}`}>
        {hero.eyebrow && <p className={styles.eyebrow}>{hero.eyebrow}</p>}
        <h1 id="hero-title" className={`${styles.headline} pre-line`}>
          {hero.headline}
        </h1>
        {hero.subheadline && <p className={styles.sub}>{hero.subheadline}</p>}
        <div className={styles.actions}>
          {hero.cta && (
            <a href={hero.cta.href} className="btn btn--primary">
              {hero.cta.label}
            </a>
          )}
          {hero.secondaryCta && (
            <a href={hero.secondaryCta.href} className="btn btn--outline">
              {hero.secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
