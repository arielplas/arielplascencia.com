import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import uiIndex from '../node_modules/@sukunagg/ui/dist/index.js?raw'
import fxIndex from '../node_modules/@sukunagg/fx/dist/index.js?raw'

// Read from disk: the test config's `css: false` blanks CSS imports, `?raw` included.
const css = readFileSync('src/index.css', 'utf8')

const sources = import.meta.glob<string>(['./**/*.tsx', '!./**/*.test.tsx'], {
  query: '?raw',
  import: 'default',
  eager: true,
})

const names = (list: string) =>
  list
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name && !name.startsWith('type '))

/** Export name → its folder under dist/components, read from the library's barrel file. */
const componentFolders = (index: string) => {
  const folders = new Map<string, string>()
  for (const [, list, folder] of index.matchAll(
    /import\s*\{([^}]*)\}\s*from\s*"\.\/components\/([\w-]+)"/g
  ))
    for (const name of names(list)) folders.set(name, folder)
  return folders
}

/** Folders listed in the library's `@source` line in index.css. */
const scannedFolders = (lib: string) => {
  const match = css.match(new RegExp(`@sukunagg/${lib}/dist/\\{[^}]*components/\\{([^}]*)\\}`))
  return new Set(match ? names(match[1]) : [])
}

describe('Tailwind @source in index.css', () => {
  it.each([
    ['ui', uiIndex],
    ['fx', fxIndex],
  ])('scans every @sukunagg/%s component the site imports', (lib, index) => {
    const folders = componentFolders(index)
    const scanned = scannedFolders(lib)
    const imported = Object.values(sources).flatMap((code) =>
      [...code.matchAll(new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*'@sukunagg/${lib}'`, 'g'))]
        .flatMap(([, list]) => names(list))
        .filter((name) => folders.has(name))
    )
    expect(imported.length).toBeGreaterThan(0)
    const missing = imported.filter((name) => !scanned.has(folders.get(name)!))
    expect(missing.map((name) => `${name} → components/${folders.get(name)}`)).toEqual([])
  })
})
