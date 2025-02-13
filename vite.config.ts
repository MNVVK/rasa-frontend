import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
        },
        manifest:{
          name: "RASA",
          short_name: "RASA",
          start_url: "/",
          display: "standalone",
          background_color: "#f0f0f0",
          theme_color: "#f5d4d0",
          orientation: "portrait-primary",
          icons: [
            {
              "src": "img.png",
              "type": "image/png", "sizes": "512x512"
            }
          ],
        }
      }),
  ],
  base: '/rasa-frontend/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  }
})
