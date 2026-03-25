/**
 * Detox Configuration
 * Learn more at https://wix.github.io/detox/#/configuration
 */

module.exports = {
  testRunner: {
    args: {
      $0: "jest",
      config: "e2e/jest.config.js",
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    "ios.debug": {
      type: "ios.app",
      binaryPath:
        "ios/build/Build/Products/Debug-iphonesimulator/CardScannerApp.app",
      build:
        "xcodebuild -workspace ios/CardScannerApp.xcworkspace -scheme CardScannerApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
    },
    "android.debug": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build:
        "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..",
      reversePorts: [8081],
    },
    "android.release": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/release/app-release.apk",
      build:
        "cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release && cd ..",
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: {
        type: "iPhone 16",
      },
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "Medium_Phone_API_36.1",
      },
    },
    attached: {
      type: "android.attached",
      device: {
        adbName: "emulator-5554",
      },
    },
  },
  configurations: {
    "ios.sim": {
      device: "simulator",
      app: "ios.debug",
    },
    "android.emu": {
      device: "emulator",
      app: "android.debug",
    },
    "android.emu.release": {
      device: "emulator",
      app: "android.release",
    },
    "android.att.release": {
      device: "attached",
      app: "android.release",
    },
  },
};
