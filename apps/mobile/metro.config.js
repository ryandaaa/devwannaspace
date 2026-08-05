const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-webview') {
    return context.resolveRequest(context, 'react-native-web-webview', platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
