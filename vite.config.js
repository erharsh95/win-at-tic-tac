import { defineConfig } from 'vite';

// Minimal Vite config to serve the vanilla HTML/CSS/JS app
export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: false,
    host: true,
  },
  preview: {
    port: 5173,
    host: true,
  },
});
