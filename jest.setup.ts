import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mocking Native Modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('expo-modules-core', () => require('expo-modules-core/mock'));

// Mocking Async Storage
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// Mock Expo Permissions and Constants
jest.mock('expo-permissions', () => ({
  getAsync: jest.fn(),
  askAsync: jest.fn(),
}));
jest.mock('expo-constants', () => ({
  manifest: {
    releaseChannel: 'default',
  },
}));