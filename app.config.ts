import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Free Fruits',
  slug: 'free-fruits',
  owner: 'kyrol86',
  version: '1.0.0',
  scheme: 'freefruits',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.freefruits.app',
    infoPlist: {
      NSCameraUsageDescription:
        'Free Fruits needs your camera to photograph a tree on site — the photo carries the GPS stamp that proves it exists.',
      NSLocationWhenInUseUsageDescription:
        'Free Fruits needs your location to show nearby trees, enable check-ins within 25 m of a pin, and stamp new tree photos with GPS.',
      NSPhotoLibraryUsageDescription:
        'Free Fruits can use a photo from your library when uploading a tree, as long as it carries a location.',
    },
  },
  android: {
    package: 'com.freefruits.app',
    adaptiveIcon: {
      backgroundColor: '#12734A',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    permissions: [
      'CAMERA',
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'READ_MEDIA_IMAGES',
      'POST_NOTIFICATIONS',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-status-bar',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F5F7F2',
        image: './assets/splash-icon.png',
        imageWidth: 160,
        dark: {
          image: './assets/splash-icon.png',
          backgroundColor: '#0D1210',
        },
      },
    ],
    'expo-localization',
    [
      'expo-camera',
      {
        cameraPermission:
          'Free Fruits needs your camera to photograph a tree on site — the photo carries the GPS stamp that proves it exists.',
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Free Fruits needs your location to show nearby trees, enable check-ins within 25 m of a pin, and stamp new tree photos with GPS.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'Free Fruits can use a photo from your library when uploading a tree, as long as it carries a location.',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/icon.png',
        color: '#D4148B',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: '094c68cc-d3e7-4c52-8295-2f0f4dbf09bc',
    },
  },
};

export default config;
