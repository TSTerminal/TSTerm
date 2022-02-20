import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/publicApi.ts',
  output: {
    file: 'lib/tsterm.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    typescript(),
  ]
};
