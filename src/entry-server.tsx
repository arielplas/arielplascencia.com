import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import App from './App.tsx'

/** The whole page as HTML, lazy sections included, for scripts/prerender.ts. */
export const render = async () => {
  const { prelude } = await prerender(
    <StrictMode>
      <App />
    </StrictMode>
  )
  return new Response(prelude).text()
}
