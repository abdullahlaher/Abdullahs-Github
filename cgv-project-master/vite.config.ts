import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'
import { resolve } from 'pathe'

export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        lost: resolve(__dirname, 'lost.html'),
      },
      //add lost.styles.css to the bundle
    },
  },
  resolve: {
    alias: {
      '/@': resolve(__dirname, './src'),
    },
  },
  plugins: [glsl()],
})
