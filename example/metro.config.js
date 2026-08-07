// metro.config.js
//
// Extends React Native's default Metro config (required from RN 0.73+).
// The `react-native-izooto` package under test is linked from the repo root
// (`"react-native-izooto": "link:../"`), so its source lives one level up and
// must be watched and have its dependencies resolved from this example app.

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
// The linked react-native-izooto package (repo root, contains ./src).
const packageRoot = path.resolve(projectRoot, '..');

/**
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // Let Metro read the linked package's source outside the project root.
  watchFolders: [packageRoot],
  resolver: {
    // The linked package has no node_modules of its own; resolve its
    // dependencies (react-native, invariant, ...) from this example app.
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    extraNodeModules: {
      // Yarn cannot materialise `node_modules/react-native-izooto` (the
      // `link:../` target is an ancestor of this project), so map the module
      // name to the package root explicitly.
      'react-native-izooto': packageRoot,
      // Ensure a single copy of react / react-native is used everywhere.
      react: path.resolve(projectRoot, 'node_modules/react'),
      'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
