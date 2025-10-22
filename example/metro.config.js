const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Add alias for react-zombie-freeze to point directly to source
    extraNodeModules: {
      'react-zombie-freeze': path.resolve(__dirname, '../src'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
