import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions:{
        enabled:true
      },
      manifest: {
        name: 'FIZZYHUB', // Aapki app ka naam
        short_name: 'PhotoApp',
        description: 'My Awesome Photo App',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // Yeh standalone app ki tarah open karega
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
