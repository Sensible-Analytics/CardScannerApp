/* global by, element */

const {
  launchCleanApp,
  openContactsTab,
  openScanTab,
  openSettingsTab,
  relaunchApp,
  resetAppDataFromSettings,
  seedSampleContacts,
  waitForVisible,
} = require("./helpers/app");

describe("Settings persistence and reset", () => {
  beforeEach(async () => {
    await launchCleanApp();
    await resetAppDataFromSettings();
  });

  it("persists scanner-relevant settings across app relaunch", async () => {
    await openSettingsTab();
    await waitForVisible(element(by.id("language-toggle-spa")));
    await element(by.id("language-toggle-spa")).tap();
    await element(by.id("auto-save-switch")).tap();
    await element(by.id("cellular-option")).tap();

    await openScanTab();
    await expect(element(by.id("ocr-profile-summary"))).toHaveText(
      "OCR profile: English, Spanish"
    );
    await expect(element(by.id("auto-save-summary"))).toHaveText(
      "Auto-save: Off"
    );

    await relaunchApp();

    await openScanTab();
    await expect(element(by.id("ocr-profile-summary"))).toHaveText(
      "OCR profile: English, Spanish"
    );
    await expect(element(by.id("auto-save-summary"))).toHaveText(
      "Auto-save: Off"
    );
  });

  it("resets saved contacts and settings back to defaults", async () => {
    await openSettingsTab();
    await waitForVisible(element(by.id("language-toggle-spa")));
    await element(by.id("language-toggle-spa")).tap();
    await element(by.id("auto-save-switch")).tap();
    await seedSampleContacts();

    await resetAppDataFromSettings();

    await openContactsTab();
    await expect(element(by.id("empty-state-view"))).toBeVisible();

    await openScanTab();
    await expect(element(by.id("ocr-profile-summary"))).toHaveText(
      "OCR profile: English"
    );
    await expect(element(by.id("auto-save-summary"))).toHaveText(
      "Auto-save: On"
    );
  });
});
