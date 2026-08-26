import 'dotenv/config';

export default {
  expo: {
    name: 'Market Memory',
    slug: 'market-memory',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'market-memory',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.marketmemory.app',
    },
    android: {
      package: 'com.marketmemory.app',
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: 'static',
    },
    extra: {
      apiUrl: process.env.API_URL || 'http://10.0.2.2:8000',
    },
    plugins: ['expo-router', 'expo-splash-screen', 'expo-secure-store'],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
