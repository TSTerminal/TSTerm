import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/publicApi.ts',
  output: [
    {
      file: 'lib/iife/tsterm.js',
      format: 'iife',
      name: 'org_omp_tsterm_tn3270',
      sourcemap: true,
      banner: '/*\n' +
        '\tThis program and the accompanying materials are\n' +
        '\tmade available under the terms of the Eclipse Public License v2.0 which accompanies\n' +
        '\tthis distribution, and is available at https://www.eclipse.org/legal/epl-v20.html\n' +
        '\n\tSPDX-License-Identifier: EPL-2.0\n\n' +
        '\tCopyright Contributors to the Zowe Project.\n' +
        '\tCopyright Contributors to the Open Mainframe Project\'s TSTerm Project\n' +
        '*/\n'
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
