import { defineConfig } from 'vite';

// base: './' fa funzionare la build sia su GitHub Pages
// (https://utente.github.io/nome-repository/) sia su un dominio personalizzato.
export default defineConfig({
  base: './',
  server: { open: true },
  build: { outDir: 'dist', assetsInlineLimit: 0 },
});
