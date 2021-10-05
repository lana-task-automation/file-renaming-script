import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: {
        file: 'build/renamer.cjs.js',
        format: 'cjs',
        exports: 'auto',
    },
    plugins: [
        typescript(),
        nodeResolve(),
        commonjs(),
        terser(),
    ],
};
