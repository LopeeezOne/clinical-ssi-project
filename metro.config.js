const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = true;

module.exports = config;

//exports.resolver = {
//    ...defaultResolver,
//    sourceExts: [...defaultResolver.sourceExts, 'cjs'],
//    resolverMainFields: ['react-native', 'main', 'browser'],
//    unstable_enablePackageExports: true,
//    unstable_conditionNames: ['react-native', 'require', 'import', 'exports', 'browser', 'main'],
//  }
//  config.resolver.resolverMainFields.push('react-native', 'main', 'browser');
