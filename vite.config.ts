import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import svgrPlugin from 'vite-plugin-svgr';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      // import svg
      svgrPlugin(),
      // linter
      checker({
        overlay: false,
        typescript: true,
      }),
      // emotion setup with react
      react({
        jsxImportSource: '@emotion/react',
        babel: { plugins: ['@emotion/babel-plugin'] },
      }),
    ],
    optimizeDeps: { esbuildOptions: {
      // Node.js global to browser globalThis
      define: { global: 'globalThis' },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    } },
    build: { outDir: 'build' },
  };
});
