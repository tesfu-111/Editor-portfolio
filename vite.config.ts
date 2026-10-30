
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import express from 'express';
import { defineConfig, type Plugin } from 'vite';
import apiRouter from './server/apiRouter.ts';

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-middleware',
    configureServer(server) {
      const app = express();
      app.use(express.json({ limit: '50mb' }));
      app.use(express.urlencoded({ extended: true, limit: '50mb' }));
      app.use('/api', apiRouter);
      server.middlewares.use(app);
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/Editor-portfolio/',

    plugins: [react(), tailwindcss(), expressApiPlugin()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
