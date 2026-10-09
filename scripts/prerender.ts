// Writes the rendered page into dist/index.html, so the first paint needs only the HTML and
// CSS instead of waiting for the JS bundle. Runs after the client and SSR builds (`bun run build`).
import { readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

// React picks its production server build from this, and the SSR bundle leaves React external.
process.env.NODE_ENV = 'production'

const ROOT = '<div id="root"></div>'
const { render } = await import(pathToFileURL('dist-ssr/entry-server.js').href)
const html = await readFile('dist/index.html', 'utf8')
if (!html.includes(ROOT)) throw new Error(`prerender: ${ROOT} not found in dist/index.html`)

const app: string = await render()
// A replacer function, so `$&` and friends in the page text are not treated as patterns.
await writeFile(
  'dist/index.html',
  html.replace(ROOT, () => `<div id="root">${app}</div>`)
)
await rm('dist-ssr', { recursive: true, force: true })
console.log(`prerender: wrote ${(app.length / 1024).toFixed(1)} kB of markup into dist/index.html`)
