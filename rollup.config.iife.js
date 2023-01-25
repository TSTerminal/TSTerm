import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/publicApi.ts',
  output: [
    {
      file: 'lib/iife/tsterm.js',
      format: 'iife',
      name: 'org_omp_tsterm_tn3270',
      sourcemap: true
    },
    {
      file: 'lib/iife/tsterm.min.js',
      format: 'iife',
      name: 'org_omp_tsterm_tn3270',
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
