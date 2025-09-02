// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import fs from 'node:fs'
import path from 'node:path'


const isTauri = process.env.VITE_TAURI === 'true'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  const hasCerts =
    fs.existsSync(path.resolve(__dirname, 'cert.key')) &&
    fs.existsSync(path.resolve(__dirname, 'cert.crt'))

  return {
    plugins: [
      react(),
      // mkcert только в DEV и только если это не tauri и есть cert-файлы
      !isProd && !isTauri && hasCerts && mkcert(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: !isProd },
        manifest: {
          name: 'RASA',
          short_name: 'RASA',
          start_url: '/',
          display: 'standalone',
          background_color: '#f0f0f0',
          theme_color: '#f5d4d0',
          orientation: 'portrait-primary',
          icons: [{ src: 'img.png', type: 'image/png', sizes: '512x512' }],
        },
      }),
    ].filter(Boolean),

    base: '/',
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
      // HTTPS только в DEV, не Tauri, и если ключи есть
      https: !isProd && !isTauri && hasCerts
        ? {
            key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
            cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
          }
        : undefined,
    },
    build: { outDir: 'dist' },
  }
})
