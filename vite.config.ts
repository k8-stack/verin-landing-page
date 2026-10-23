import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const page = (p: string) => decodeURIComponent(new URL(p, import.meta.url).pathname);

// Multi-page build: each route is real static HTML, so any static host serves it without rewrites.
export default defineConfig({
  plugins: [react()],
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        solutions: page('./solutions/index.html'),
        developers: page('./developers/index.html'),
        security: page('./security/index.html'),
        contact: page('./contact/index.html'),
        privacy: page('./privacy/index.html'),
        notfound: page('./404.html'),
      },
    },
  },
});
