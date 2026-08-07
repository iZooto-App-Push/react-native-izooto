// react-native.config.js
//
// The `react-native-izooto` package under test lives at the repo root and is
// declared as `"react-native-izooto": "link:../"` in package.json. Yarn's
// node-modules linker refuses to materialise that symlink (the target is an
// ancestor of this project, which would create a cycle), so autolinking cannot
// discover the package through `node_modules/`.
//
// Pointing the CLI at the package root explicitly is the standard pattern for
// a library's own example app: it makes `autolinkLibrariesWithApp()` (Android)
// and `use_native_modules!` (iOS) pick up the local library sources directly.

const path = require('path');
const pkg = require('../package.json');

module.exports = {
  dependencies: {
    [pkg.name]: {
      root: path.resolve(__dirname, '..'),
    },
  },
};
