import { defineConfig } from 'vite';

// La build finisce in docs/, la cartella che GitHub Pages pubblica direttamente.
// base: './' fa funzionare la build sia su GitHub Pages
// (https://utente.github.io/nome-repository/) sia su un dominio personalizzato.
export default defineConfig({
  base: './',
  server: { open: true },
  build: { outDir: 'docs', emptyOutDir: true, assetsInlineLimit: 0 },
});
