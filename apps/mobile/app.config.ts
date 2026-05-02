import type { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'TripPilot',
  slug: 'trippilot',
  version: '1.0.0',
  orientation: 'portrait',
  ios: {
    bundleIdentifier: process.env.EXPO_IOS_BUNDLE_ID ?? 'com.example.trippilot',
    buildNumber: process.env.EXPO_IOS_BUILD_NUMBER ?? '1'
  },
  android: {
    package: process.env.EXPO_ANDROID_PACKAGE ?? 'com.example.trippilot',
    versionCode: Number(process.env.EXPO_ANDROID_VERSION_CODE ?? 1)
  },
  extra: {
    eas: { projectId: process.env.EXPO_EAS_PROJECT_ID ?? '00000000-0000-0000-0000-000000000000' }
  }
};

export default config;
