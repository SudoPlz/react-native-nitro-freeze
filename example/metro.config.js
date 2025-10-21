const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pak = require('../package.json');

const modules = Object.keys({
  ...pak.peerDependencies,
});

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  projectRoot: __dirname,
  watchFolders: [root],

  resolver: {
    blacklistRE: exclusionList(
      modules.map(
        (m) => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
      )
    ),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
};

function exclusionList(rules) {
  return new RegExp(
    '(' +
      rules
        .map((rule) =>
          rule instanceof RegExp ? rule.source : `.*\\/${rule}\\/.*`
        )
        .join('|') +
      ')$'
  );
}

function escape(str) {
  return str.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
