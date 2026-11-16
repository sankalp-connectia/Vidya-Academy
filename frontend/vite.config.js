import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/,
              priority: 30,
            },
            {
              name: 'gsap-vendor',
              test: /node_modules[\\/]gsap[\\/]/,
              priority: 25,
            },
            {
              name: 'motion-vendor',
              test: /node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/,
              priority: 25,
            },
            {
              name: 'swiper-vendor',
              test: /node_modules[\\/]swiper[\\/]/,
              priority: 25,
            },
            {
              name: 'icon-vendor',
              test: /node_modules[\\/]lucide-react[\\/]/,
              priority: 25,
            },
            {
              name: 'vendor',
              test: /node_modules[\\/]/,
              minSize: 20000,
              maxSize: 220000,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})
