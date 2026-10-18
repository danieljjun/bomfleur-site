// 빌드 시 프리렌더용 (scripts/prerender.mjs가 사용). 브라우저에서는 쓰이지 않는다.
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'

const pages = {
  'index.html': App,
  'privacy.html': PrivacyPage,
}

export const pageFiles = Object.keys(pages)

export function render(file) {
  const Page = pages[file]
  return renderToString(<Page />)
}
