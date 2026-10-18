import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { HERO_FLOWER_SIZES, imageAttrs } from './src/lib/images.js'
import { themeCss } from './src/lib/theme.js'

const PAGES = { main: 'index.html', privacy: 'privacy.html' }

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch])

const readClient = () => JSON.parse(readFileSync(new URL('./src/data/client.json', import.meta.url), 'utf-8'))

const absoluteUrl = (siteUrl, path) => new URL(path, siteUrl.replace(/\/?$/, '/')).href

const meta = (attr, key, content) => (content ? `<meta ${attr}="${key}" content="${escapeHtml(content)}" />` : '')

// 검색엔진용 업체 정보 (schema.org LocalBusiness)
function localBusinessJsonLd(client) {
  const { meta: m, brand, footer } = client
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: brand.name,
    alternateName: brand.nameEn || undefined,
    description: m.description,
    url: m.siteUrl,
    image: absoluteUrl(m.siteUrl, m.ogImage),
    telephone: footer.phone || undefined,
    email: footer.email || undefined,
    address: footer.address ? { '@type': 'PostalAddress', streetAddress: footer.address, addressCountry: 'KR' } : undefined,
    openingHours: m.openingHours?.length ? m.openingHours : undefined,
    sameAs: footer.social?.map((s) => s.url),
  }
  // </script> 같은 문자열이 JSON 안에 있어도 태그가 깨지지 않도록 < 를 이스케이프
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

// <!--head-tags--> 자리에 client.json 기반 메타태그를 넣는다
function headTags(client, page) {
  const { meta: m, brand, privacy } = client
  const isHome = page === 'index.html'
  const title = isHome ? m.title : `${privacy.title} | ${brand.name}`
  const description = isHome ? m.description : `${brand.name}의 ${privacy.title}입니다.`
  const url = absoluteUrl(m.siteUrl, isHome ? '/' : `/${page}`)
  const ogImage = absoluteUrl(m.siteUrl, m.ogImage)
  // 첫 화면의 가장 중요한 이미지(LCP): 꽃 사진이 있으면 꽃, 없으면 배경 사진
  const { flowerImage, model, fallbackImage } = client.hero
  const hero = !isHome ? null : flowerImage && !model ? imageAttrs(flowerImage, HERO_FLOWER_SIZES) : imageAttrs(fallbackImage, '100vw')

  return [
    `<title>${escapeHtml(title)}</title>`,
    meta('name', 'description', description),
    isHome && meta('name', 'keywords', m.keywords?.join(', ')),
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    meta('name', 'theme-color', brand.colors.primary),
    `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
    meta('name', 'naver-site-verification', m.verification?.naver),
    meta('name', 'google-site-verification', m.verification?.google),
    // 공유 미리보기 (카카오톡·페이스북 등)
    meta('property', 'og:type', 'website'),
    meta('property', 'og:locale', 'ko_KR'),
    meta('property', 'og:site_name', brand.name),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    meta('property', 'og:url', url),
    meta('property', 'og:image', ogImage),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', ogImage),
    // 폰트는 사이트 글자만 담은 파일 하나를 미리 받는다
    `<link rel="preload" as="font" type="font/woff2" href="/fonts/pretendard-subset.woff2" crossorigin />`,
    // 업체 색상 (JS 실행 전부터 적용)
    `<style>${themeCss(brand.colors)}</style>`,
    // JS가 꺼져 있어도 스크롤 등장 효과로 숨겨진 내용이 보이도록
    `<noscript><style>.reveal{opacity:1;transform:none}</style></noscript>`,
    // 히어로 이미지(LCP)를 가장 먼저 받는다
    hero?.srcSet &&
      `<link rel="preload" as="image" href="${hero.src}" imagesrcset="${hero.srcSet}" imagesizes="${hero.sizes}" fetchpriority="high" />`,
    isHome && localBusinessJsonLd(client),
  ]
    .filter(Boolean)
    .join('\n    ')
}

function clientSite() {
  return {
    name: 'client-site',
    transformIndexHtml(html, ctx) {
      const page = ctx.path.split('/').pop() || 'index.html'
      return html.replace('<!--head-tags-->', headTags(readClient(), page))
    },
    // robots.txt / sitemap.xml 생성
    generateBundle() {
      if (this.environment?.config.build.ssr) return
      const { meta: m } = readClient()
      const today = new Date().toLocaleDateString('sv-SE') // YYYY-MM-DD (현지 날짜)
      const urls = Object.values(PAGES).map((p) => absoluteUrl(m.siteUrl, p === 'index.html' ? '/' : `/${p}`))
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl(m.siteUrl, '/sitemap.xml')}\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls.map((u) => `  <url><loc>${escapeHtml(u)}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
          `\n</urlset>\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), clientSite()],
  build: {
    // three.js가 든 Hero3D 청크는 히어로에서만 지연 로딩하므로 경고 기준을 높인다
    chunkSizeWarningLimit: 1100,
    rolldownOptions: {
      input: PAGES,
    },
  },
})
