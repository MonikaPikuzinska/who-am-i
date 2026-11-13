import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so asset URLs work on GitHub Pages without knowing the repo name.
// This app has no client-side router, so relative paths stay valid in a project site.
export default defineConfig({
  base: './',
  plugins: [react()],
})
