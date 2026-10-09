import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The component libraries go through Vite instead of Node's resolver:
// @sukunagg/video (re-exported by ui) uses directory imports Node cannot resolve.
const SUKUNAGG = ['@sukunagg/ui', '@sukunagg/fx', '@sukunagg/video']

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // The SSR build that scripts/prerender.ts renders from keeps React external: nothing to split.
        manualChunks: isSsrBuild
          ? undefined
          : {
              react: ['react', 'react-dom', 'react-dom/client'],
            },
      },
    },
  },
  ssr: { noExternal: SUKUNAGG },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
    server: { deps: { inline: SUKUNAGG } },
  },
}))
