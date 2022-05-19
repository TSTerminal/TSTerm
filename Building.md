# Building the terminal.

## Development

For most development purposes, there isn't much of a build of this package, per se.   The TypeScript code is compiled using "tsc".   There is a standalone server under https://github.com/JoeNemo/tsterm/new/main/simpleproxy that serves test pages that include the compiled TS code as ES6 modules directly.  It is hoped that the absence of a complex npm/node/webpack/babel/whatever toolchain allows people who know 3270 to contribute without having to become web UI developent experts.  We use a simple ES6 module rollup tool called "Rollup" (https://www.npmjs.com/package/rollup).  

## Testing 

### Running the test proxy server

The test Proxy Server (which turns 3270 protocol into a WebSocket conversation) can be run using:

`node simpleproxy/main.js <port>`

To run this code you must first npm install in the simpleproxy directory.   This dependencies of this server are on ExpessJS and few other tiny things.
  
The test proxy server also serves static pages to test in a browser.  Navigate to the following URL in a modern browser:
  
`http://localhost:<port>/static/app/termtest.html`

## Deployment

Rollup scripts in the package.json for this repo. These will work well if you use the CLI.   However, if you don't:

* Copy rollup-config.js to rollup-config.mjs
* node --experimental-json-modules node_modules/rollup/dist/bin/rollup --config

