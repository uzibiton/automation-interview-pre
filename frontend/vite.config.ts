import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: '0.0.0.0',
    strictPort: false,
    hmr: {
      clientPort: parseInt(process.env.PORT || '3000'),
    },
    watch: {
      usePolling: true,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '3000'),
    strictPort: false,
  },
  define: {
    'process.env': {},
  },
});
