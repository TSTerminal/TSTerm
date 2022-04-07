import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/publicApi.ts',
  output: {
    file: 'lib/tsterm.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    typescript(),
    //terser(),
  ]
};
