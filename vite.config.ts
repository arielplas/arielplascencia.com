import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
    // Let Vite transform the component libraries instead of Node's resolver.
    // @sukunagg/video (re-exported by ui) uses directory imports Node cannot resolve.
    server: { deps: { inline: ['@sukunagg/ui', '@sukunagg/fx', '@sukunagg/video'] } },
  },
})
