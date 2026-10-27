# CLAUDE.md

## 프로젝트 개요
소상공인 대행용 3D 홈페이지 템플릿. 사이트 언어는 한국어.
하나의 템플릿을 업체마다 데이터만 바꿔 재사용하는 것이 목표.

## 기술 스택
- Vite + React
- @react-three/fiber + @react-three/drei (3D)
- 폰트: Pretendard

## 핵심 규칙

### 업체 데이터 분리
- 업체별 내용(상호, 소개, 이미지, 상품 링크, 교육 목록, 색상)은 **전부 `src/data/client.json`에서만 읽는다.**
- 컴포넌트에 업체 문구·이미지 경로·링크·색상을 하드코딩하지 않는다.
- 색상은 `client.json` 값을 CSS 변수 등으로 주입해 사용한다.

### 3D 사용 범위
- 3D는 **메인 히어로에만** 쓴다. 나머지는 일반(2D) 섹션으로 만든다.

### 모바일 우선
- 모바일 레이아웃을 먼저 설계하고 데스크톱으로 확장한다.
- 모바일에서 3D가 무거우면 **정지 이미지로 대체**한다.

### 결제
- 결제는 **네이버 스마트스토어 링크로 연결**하고 새 탭으로 연다 (`target="_blank" rel="noopener noreferrer"`).
- 사이트 내부에 결제 기능은 만들지 않는다.

### 이미지·폰트
- 이미지는 **webp** 형식, **lazy loading**(`loading="lazy"`)을 사용한다.
  - 예외: 공유 미리보기용 OG 이미지(`public/og.jpg`)만 JPG (일부 메신저·SNS가 webp 미리보기를 지원하지 않음).
- 원본 사진은 `images-src/`에 넣고 `npm run images`로 변환한다. `public/images/`는 생성물이므로 직접 수정하지 않는다.
- 폰트는 Pretendard를 사용한다. 빌드 때 사이트에 쓰인 글자만 담은 서브셋(`public/fonts/`)을 만든다.

### 성능 기준
- Lighthouse 모바일: 성능 90점 이상, 접근성·권장사항·SEO 95점 이상 유지.
- 터치 영역은 최소 44px, 텍스트 대비는 WCAG AA(4.5:1) 이상. client.json 색상을 바꿀 때 대비를 확인한다.

## 명령어
- `npm run dev` 개발 서버 / `npm run lint` 린트(oxlint)
- `npm run build` 인스타 피드 수집 → 폰트 서브셋 → 빌드 → 프리렌더 (결과물: `dist/`, 확인: `npx vite preview`)
- `npm run images` `images-src/` 원본 → 크기별 webp, OG 이미지, 파비콘 생성
- `npm run fonts` 폰트 서브셋만 다시 생성
- `npm run instagram` 인스타 피드만 다시 받기 (Behold 조회 1회 차감)

## 배포
- Cloudflare Workers(정적 자산): `wrangler.jsonc`가 `dist`를 배포한다. Workers Builds 설정은 빌드 명령 `npm run build`, 배포 명령 `npx wrangler deploy`, Node 22(`.node-version`).
- 로컬에서 배포 환경과 같게 확인: `npm run build` 후 `npx wrangler dev`.
- Cloudflare는 `/페이지.html`을 `/페이지`로 리다이렉트하므로 링크·canonical·sitemap은 확장자 없는 주소를 쓴다(`vite.config.js`의 `pagePath`).
- `.github/workflows/daily-rebuild.yml`이 매일 새벽 3시(KST) 배포 훅(`CF_PAGES_DEPLOY_HOOK` 시크릿, Worker → Settings → Builds → Deploy Hooks)을 호출해 인스타 피드를 갱신한다.

## 구조
- `src/data/client.json` 업체 데이터 (meta, brand, hero, about, portfolio, products, education, footer, privacy)
- `src/data/image-manifest.json` 이미지 크기 정보 (`npm run images`가 생성)
- `src/components/hero/` 히어로와 3D (`Hero3D`는 첫 화면이 그려진 뒤 지연 로딩, `hooks/useCan3D.js`)
  - `hero.enable3D: false`면 3D를 끄고(three.js 미로딩) 배경 정지 이미지만 보여준다. 꽃 사진도 빼려면 `hero.flowerImage: null`.
  - 3D 오브젝트 우선순위: `hero.model`(glb) → `hero.flowerImage`(배경을 오려낸 투명 webp, `FlowerImage.jsx`) → 기본 TorusKnot.
  - 사진 오브젝트는 앞면만 있으므로 회전시키지 않고 기울기(±20°)·둥실만 준다.
  - `hero.flowerImage`가 있으면 배경(`hero.fallbackImage`)은 항상 옅게 깔고, 같은 꽃 사진을 정지 이미지로 3D와 같은 자리에 둔다(`Hero.module.css` `.flower`). 3D 꽃이 준비되면 정지 꽃은 사라진다. 저사양·동작 줄이기에서는 정지 꽃이 그대로 보인다. 3D 위치·크기를 바꾸면 `.flower` 값도 함께 맞춘다.
  - 정지 꽃 사진이 LCP이므로 `<head>`에서 preload한다(`HERO_FLOWER_SIZES`).
- `src/components/sections/` 일반 섹션 / `src/components/common/` 공용 컴포넌트 / `src/pages/` 별도 페이지
- portfolio 섹션은 인스타그램 피드다. **빌드할 때** `scripts/fetch-instagram.mjs`가 `portfolio.instagram.feedUrl`(Behold JSON 피드)을 받아 `src/data/instagram-feed.json`에 저장하고, 사이트는 이 파일만 읽는다. 방문자 브라우저에서 피드를 요청하지 않는다(사진만 behold.pictures에서 받음).
  - 수집 실패 시 직전 `instagram-feed.json`을 유지하고, 그것도 비어 있으면 `portfolio.items` 이미지로 대체한다. 표시 개수는 `portfolio.galleryCount`(기본 6), 모든 화면에서 3열.
  - Behold 무료 플랜: 게시물 6개, 피드 요청 월 1,200회(초과 시 그달 정지), 하루 1회 갱신. 그래서 런타임 요청으로 되돌리지 않는다.
  - 피드 주소는 공개값이지만 Meta 액세스 토큰은 코드·client.json에 절대 넣지 않는다.
  - 외부 서비스를 추가·변경하면 `privacy.sections`의 자동 수집 항목도 함께 고친다.
- 스마트스토어 연결: `store.homeUrl`은 헤더의 "스토어 바로가기"(`common/Header.jsx`), 카드 버튼은 상품별 `url`/`applyUrl` → 섹션 `storeUrl` 순으로 연결한다. 둘 다 없으면 "문의하기"(`common/ContactButton.jsx`: `store.contactUrl`, 없으면 `store.contactPhone`(없으면 `footer.phone`) 전화). 결제 안내 문구는 `store.notice`.
- 견적 문의: `sections/QuoteCard.jsx`(#quote, 교육 섹션 아래)가 `quoteForm` 값을 표시하고 `quoteForm.url`(구글 설문지)을 새 탭으로 연다. url이 비면 전화·카카오톡 채널 안내로 대체. 헤더 메뉴(`Header`의 `nav`)에서 #quote로 스크롤. 상품·교육 카드에는 견적 버튼을 넣지 않는다.
  - 폼으로 개인정보를 받으므로 `privacy.sections`(수집 항목·보유 기간·국외 이전)를 폼 내용과 맞춘다.
- 외부 링크 버튼은 `common/ExternalButton.jsx`, 이미지는 `common/Img.jsx`를 쓴다 (새 탭·lazy·srcset 처리가 들어 있음)
- 페이지: `index.html`(메인, `/`), `privacy.html`(개인정보처리방침, `/privacy`). 새 페이지는 `vite.config.js`의 `PAGES`와 `src/entry-server.jsx`에 함께 등록한다.
- `vite.config.js`가 `<!--head-tags-->`에 제목·메타·OG·JSON-LD·색상 변수를 넣고, `robots.txt`·`sitemap.xml`을 만든다.
- 빌드 시 `scripts/prerender.mjs`가 HTML을 미리 렌더링한다. 컴포넌트는 서버 렌더와 첫 클라이언트 렌더 결과가 같아야 한다 (렌더 중 `window` 분기 금지, 브라우저 전용 판단은 `useEffect`에서).

## 작업 방식
- **구현 전에 계획을 먼저 보여주고, 사용자 승인을 받은 뒤 작업한다.**
