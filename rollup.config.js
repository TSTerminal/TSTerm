import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/publicApi.ts',
  output: [
    {
      file: 'lib/tsterm.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'lib/tsterm.min.js',
      format: 'es',
      sourcemap: true,
      plugins: [
        terser()
      ]
    }
  ],
  plugins: [
    typescript(),
  ]
};
