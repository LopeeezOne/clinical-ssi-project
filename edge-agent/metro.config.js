const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname);

// Correctly add 'json' to the list of extensions
config.resolver.sourceExts.push('json');

// Ensure other common file types are included as well
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs', 'png', 'jpg'];
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
