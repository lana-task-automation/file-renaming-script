import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.js',
    output: {
        file: 'build/renamer.cjs.js',
        format: 'cjs',
        exports: 'auto',
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        terser(),
    ],
};
