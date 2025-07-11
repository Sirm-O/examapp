import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactNative from '@vitejs/plugin-react-native';

export default defineConfig({
  plugins: [react(), reactNative()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
