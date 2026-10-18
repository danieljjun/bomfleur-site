import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/global.css'
import PrivacyPage from './pages/PrivacyPage.jsx'

const root = document.getElementById('root')
const page = (
  <StrictMode>
    <PrivacyPage />
  </StrictMode>
)

if (root.firstElementChild) hydrateRoot(root, page)
else createRoot(root).render(page)
