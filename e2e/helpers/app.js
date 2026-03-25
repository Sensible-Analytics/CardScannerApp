/* global by, device, element, waitFor */
const { execSync } = require("child_process");

const waitForVisible = async (matcher, timeout = 30000) => {
  await waitFor(matcher).toExist().withTimeout(timeout);
};

const launchCleanApp = async () => {
  if (device.getPlatform() === "android") {
    try {
      execSync("adb push e2e/assets/sample_card.png /sdcard/sample_card.png");
    } catch (e) {
      console.warn("Failed to push sample card to /sdcard/sample_card.png");
    }
  }

  await device.launchApp({
    newInstance: true,
    launchArgs: {
      detoxDisableCamera: "true",
      detoxInitialTab: "Scan",
      detoxEnableSynchronization: 0,
    },
    permissions: {
      camera: "YES",
      notifications: "YES",
      photos: "YES",
    },
  });

  await waitFor(element(by.id("scan-tab-button")))
    .toExist()
    .withTimeout(30000);
};

const relaunchApp = async () => {
  await device.launchApp({
    newInstance: true,
    launchArgs: {
      detoxDisableCamera: "true",
      detoxInitialTab: "Scan",
      detoxEnableSynchronization: 0,
    },
  });

  await waitFor(element(by.id("scan-tab-button")))
    .toExist()
    .withTimeout(30000);
};

const openScanTab = async () => {
  await waitFor(element(by.id("scan-tab-button"))).toExist();
  await element(by.id("scan-tab-button")).tap();
  await waitFor(element(by.id("ocr-profile-summary"))).toExist();
};

const openContactsTab = async () => {
  await waitFor(element(by.id("contacts-tab-button"))).toExist();
  await element(by.id("contacts-tab-button")).tap();
  await waitFor(element(by.id("contacts-screen"))).toExist();
};

const openSettingsTab = async () => {
  await waitFor(element(by.id("settings-tab-button"))).toExist();
  await element(by.id("settings-tab-button")).tap();
  await waitFor(element(by.id("settings-screen"))).toExist();
};

const tapAlertButton = async (label = "OK") => {
  await waitFor(element(by.text(label)))
    .toExist()
    .withTimeout(5000);
  await element(by.text(label)).tap();
};

const seedSampleContacts = async () => {
  await openSettingsTab();
  await element(by.id("qa-seed-sample-contacts-button")).tap();
  await waitFor(element(by.text("Loaded sample contacts for QA.")))
    .toExist()
    .withTimeout(5000);
  await tapAlertButton();
};

const resetAppDataFromSettings = async () => {
  await openSettingsTab();
  await element(by.id("reset-app-button")).tap();
  await waitFor(element(by.text("Reset")))
    .toExist()
    .withTimeout(5000);
  await element(by.text("Reset")).tap();
  await waitFor(element(by.text("App has been reset to default settings.")))
    .toExist()
    .withTimeout(5000);
  await tapAlertButton();
};

const dismissShareSheet = async () => {
  if (device.getPlatform() === "ios") {
    await element(by.id("close-share-sheet"))
      .tap()
      .catch(() => {});
  } else {
    await element(by.text("Cancel"))
      .tap()
      .catch(() => {});
  }
};

const launchWithPermissions = async (camera = "YES", photos = "YES") => {
  if (device.getPlatform() === "android") {
    try {
      execSync("adb push e2e/assets/sample_card.png /sdcard/sample_card.png");
    } catch (e) {
      console.warn("Failed to push sample card");
    }
  }

  await device.launchApp({
    newInstance: true,
    launchArgs: {
      detoxDisableCamera: camera === "DENY" ? "true" : "false",
      detoxInitialTab: "Scan",
      detoxEnableSynchronization: 0,
    },
    permissions: {
      camera,
      notifications: "YES",
      photos,
    },
  });

  await waitFor(element(by.id("scan-tab-button")))
    .toExist()
    .withTimeout(30000);
};

const waitForElementGone = async (matcher, timeout = 10000) => {
  await waitFor(matcher).not.toExist().withTimeout(timeout);
};

const getElementText = async (matcher) => {
  const element = await element(matcher);
  return element.getText();
};

const scrollDown = async () => {
  await element(by.id("settings-screen")).scrollTo("bottom");
};

module.exports = {
  launchCleanApp,
  openContactsTab,
  openScanTab,
  openSettingsTab,
  relaunchApp,
  resetAppDataFromSettings,
  seedSampleContacts,
  waitForVisible,
  dismissShareSheet,
  launchWithPermissions,
  waitForElementGone,
  getElementText,
  scrollDown,
};
