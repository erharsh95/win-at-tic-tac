import { defineConfig } from 'vite';

// Minimal Vite config to serve the vanilla HTML/CSS/JS app
export default defineConfig({
  root: '.',
  server: {
    port: 8080,
    open: false,
    host: true,
  },
  preview: {
    port: 8080,
    host: true,
  },
});
