import { defineConfig } from 'vite';
import { rollup_lunet } from 'lunet-transpiler';

// https://vite.dev/config/
export default defineConfig({
    plugins: [rollup_lunet()],
    esbuild: {
        jsx: 'transform',
        jsxFactory: 'h',
        jsxFragment: 'fragment',
        jsxInject: `import { h, fragment } from 'lunet'`,
    },
})
