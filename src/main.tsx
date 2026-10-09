import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Archivo with both axes: weight for body copy, width (wdth) for the expanded display caps.
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/archivo/wdth-italic.css'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
