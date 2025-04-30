// src/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:9999',    // ✅ Netlify Functions 서버
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/\.netlify\/functions/, '/.netlify/functions'),
      },
    },
  },
  preview: {
    port: 5173,
    host: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}));
