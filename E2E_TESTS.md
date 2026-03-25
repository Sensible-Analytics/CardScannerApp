# E2E Testing Guide

This guide covers automated end-to-end (E2E) testing for CardScannerApp using Detox.

## Quick Start

### Automated Testing (Recommended)

Run all E2E tests with a single command:

```bash
# Android only
npm run e2e:android

# iOS only
npm run e2e:ios

# Both platforms
npm run e2e:all
```

### Manual Step-by-Step

1. **Start Metro bundler**:

   ```bash
   npm start
   ```

2. **In another terminal, run tests**:

   ```bash
   # Android
   npm run detox:build:android && npm run detox:test:android

   # iOS
   npm run detox:build:ios && npm run detox:test:ios
   ```

## Test Structure

```
e2e/
├── helpers/
│   └── app.js           # Test helpers (launch, navigation, seeding)
├── assets/
│   └── sample_card.png  # Sample business card for mock OCR
├── scanner.e2e.js       # Scanner OCR tests
├── navigation.e2e.js     # Navigation flow tests
├── settings.e2e.js       # Settings screen tests
└── contacts.e2e.js       # Contact management tests
```

## How E2E Testing Works

### Camera Mocking

The app detects E2E mode via launch arguments and bypasses camera hardware:

1. Detox launches app with `detoxDisableCamera: true`
2. `src/utils/launchArgs.ts` detects this flag
3. Scanner shows placeholder UI instead of camera view
4. Tests tap "Mock Scan Card" button
5. Mock OCR processes `e2e/assets/sample_card.png`
6. Tests verify extracted contact info

### Launch Arguments

The following launch arguments control E2E behavior:

| Argument                     | Type    | Description                                          |
| ---------------------------- | ------- | ---------------------------------------------------- |
| `detoxDisableCamera`         | boolean | Bypasses camera and shows mock UI                    |
| `detoxInitialTab`            | string  | Initial tab to open ("Scan", "Contacts", "Settings") |
| `detoxEnableSynchronization` | number  | Disable JS/HTTP synchronization (0 = disabled)       |

### Test IDs

All interactive elements have `testID` attributes for reliable selection:

| testID                           | Component                 |
| -------------------------------- | ------------------------- |
| `app-root`                       | Root view                 |
| `scan-tab-button`                | Scan tab in bottom nav    |
| `contacts-tab-button`            | Contacts tab              |
| `settings-tab-button`            | Settings tab              |
| `mock-scan-button`               | E2E mock scan button      |
| `qa-seed-sample-contacts-button` | Load sample contacts      |
| `ocr-profile-summary`            | OCR language profile text |
| `auto-save-summary`              | Auto-save status text     |

## Writing New Tests

### Basic Test Structure

```javascript
const {
  launchCleanApp,
  openScanTab,
  waitForVisible,
} = require("./helpers/app");

describe("Feature Name", () => {
  beforeEach(async () => {
    await launchCleanApp();
  });

  it("should do something", async () => {
    // Arrange: Set up test conditions
    await openScanTab();

    // Act: Perform the action
    await element(by.id("mock-scan-button")).tap();

    // Assert: Verify results
    await expect(element(by.text("John Doe"))).toExist();
  });
});
```

### Using Helpers

The `e2e/helpers/app.js` provides common helpers:

```javascript
// Launch app fresh (with E2E args and permissions)
await launchCleanApp();

// Navigate to tabs
await openScanTab();
await openContactsTab();
await openSettingsTab();

// Relaunch app (keeps state)
await relaunchApp();

// Handle alerts
await tapAlertButton("OK");

// Seed test data
await seedSampleContacts();

// Reset app data
await resetAppDataFromSettings();

// Wait for element
await waitForVisible(element(by.id("some-element")));
```

### Testing Different Flows

#### Scanner Flow

```javascript
it("should scan and save contact", async () => {
  await openScanTab();
  await element(by.id("mock-scan-button")).tap();
  await waitForVisible(element(by.id("results-view")));
  await expect(element(by.text("John Doe"))).toExist();

  // Save contact
  await element(by.id("save-contact-button")).tap();
  await waitForVisible(element(by.text("Contact saved successfully")));
});
```

#### Contacts Flow

```javascript
it("should view saved contacts", async () => {
  await seedSampleContacts(); // Seed data first
  await openContactsTab();
  await waitForVisible(element(by.id("contacts-list")));
  await expect(element(by.text("Jane Doe"))).toExist();
});
```

#### Settings Flow

```javascript
it("should toggle auto-save", async () => {
  await openSettingsTab();
  const autoSaveSwitch = element(by.id("auto-save-switch"));
  await autoSaveSwitch.tap();
  // Verify state changed
});
```

## CI/CD Integration

### GitHub Actions

Add this workflow to `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  android-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Setup Android SDK
        uses: android-actions/setup-android@v2
      - name: Install dependencies
        run: npm ci
      - name: Build and test
        run: npm run e2e:android
        env:
          ANDROID_HOME: /opt/android-sdk

  ios-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install iOS dependencies
        run: |
          cd ios && pod install && cd ..
      - name: Build and test
        run: npm run e2e:ios
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('E2E Tests') {
            parallel {
                stage('Android') {
                    steps {
                        sh 'npm ci'
                        sh 'npm run e2e:android'
                    }
                }
                stage('iOS') {
                    steps {
                        sh 'npm ci'
                        sh 'npm run e2e:ios'
                    }
                }
            }
        }
    }

    post {
        always {
            publishHTML target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'e2e/artifacts',
                reportFiles: '*.html',
                reportName: 'E2E Test Report'
            ]
        }
    }
}
```

## Troubleshooting

### Common Issues

#### "No Android device connected"

```bash
# Start an emulator
$ANDROID_HOME/emulator/emulator -avd Pixel_4_API_33

# Or check connected devices
adb devices
```

#### "Failed to push sample card"

```bash
# Manually push
adb push e2e/assets/sample_card.png /sdcard/sample_card.png

# Or check permissions
adb shell ls -la /sdcard/
```

#### "Test times out"

```javascript
// Increase timeout in test
await waitFor(element(by.id("some-element")))
  .toExist()
  .withTimeout(60000); // 60 seconds
```

#### "Element not found"

```bash
# Dump UI hierarchy
adb shell uiautomator dump
adb pull /sdcard/window_dump.xml

# Or use logcat
adb logcat | grep -i "detox"
```

### Debug Mode

Enable verbose Detox logging:

```bash
# Set environment variable
DEBUG=detox:* npm run detox:test:android
```

### Record Test Sessions

```bash
# Record video of failing tests
npx detox test -c android.emu --record-videos failing

# Videos saved to e2e/artifacts/
```

## Best Practices

1. **Isolate tests**: Each test should be independent
2. **Use helpers**: Don't repeat setup code
3. **Seed data**: Use QA tools for consistent test data
4. **Clean state**: Reset app between tests
5. **Descriptive names**: Test names should describe what they verify
6. **One assertion per test**: Multiple small tests > one large test
7. **Wait for elements**: Always wait for UI to settle
8. **Handle alerts**: Use `tapAlertButton()` helper

## Advanced Topics

### Custom Launch Arguments

Add custom launch arguments in `e2e/helpers/app.js`:

```javascript
const launchCleanApp = async (customArgs = {}) => {
  await device.launchApp({
    newInstance: true,
    launchArgs: {
      detoxDisableCamera: "true",
      detoxInitialTab: "Scan",
      detoxEnableSynchronization: 0,
      ...customArgs, // Add your custom args here
    },
    // ...
  });
};
```

### Mocking More Features

Extend the mocking pattern for other hardware:

```javascript
// In src/utils/launchArgs.ts
export const shouldDisableLocationForE2E = async () => {
  const launchArgs = await getLaunchArgs();
  return normalizeBooleanArg(launchArgs.detoxDisableLocation);
};

// In your component
if (shouldDisableLocationForE2E()) {
  // Return mock location UI
}
```

### Parallel Test Execution

```bash
# Run tests in parallel (requires multiple emulators)
npx detox test -c android.emu --workers 2

# iOS parallel (requires multiple simulators)
npx detox test -c ios.sim --workers 2
```

## Resources

- [Detox Documentation](https://github.com/wix/Detox)
- [Detox API Reference](https://github.com/wix/Detox/blob/master/docs/APIRef.Matchers.md)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)
