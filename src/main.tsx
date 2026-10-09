import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
// Archivo with both axes: weight for body copy, width (wdth) for the expanded display caps.
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/archivo/wdth-italic.css'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The production build prerenders the page into #root (scripts/prerender.ts); the dev server
// serves it empty.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
