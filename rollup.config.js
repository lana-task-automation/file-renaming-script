import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.js',
    compact: true,
    output: [
        {
            file: 'build/renamer.cjs.js',
            format: 'cjs',
        },
        {
            file: 'build/renamer.esm.js',
            format: 'esm',
        },
    ],
    plugins: [
        nodeResolve(),
        commonjs(),
        terser(),
    ],
};
