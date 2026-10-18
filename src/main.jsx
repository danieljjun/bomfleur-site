import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// 빌드 결과물에는 프리렌더된 HTML이 들어 있으므로 hydrate, 개발 서버에서는 새로 렌더링한다.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
