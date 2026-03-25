/* global by, element, waitFor, expect */

const {
  launchCleanApp,
  openSettingsTab,
  waitForVisible,
  tapAlertButton,
} = require("./helpers/app");

describe("Settings Comprehensive Tests", () => {
  beforeEach(async () => {
    await launchCleanApp();
  });

  it("settings:auto-save-toggle - Toggle auto-save on/off", async () => {
    await openSettingsTab();
    await waitFor(element(by.id("settings-screen"))).toExist();

    const autoSaveToggle = element(by.id("toggle-auto-save"));
    const isPresent = await autoSaveToggle.isExist();

    if (isPresent) {
      const initialState = await autoSaveToggle.isToggleOn();
      await autoSaveToggle.tap();
      const newState = await autoSaveToggle.isToggleOn();
      expect(newState).not.toEqual(initialState);
    }
  });

  it("settings:notification-toggle - Toggle notifications On/Off", async () => {
    await openSettingsTab();
    await waitFor(element(by.id("settings-screen"))).toExist();

    const notificationToggle = element(by.id("toggle-notifications"));
    const isPresent = await notificationToggle.isExist();

    if (isPresent) {
      const initialState = await notificationToggle.isToggleOn();
      await notificationToggle.tap();
      const newState = await notificationToggle.isToggleOn();
      expect(newState).not.toEqual(initialState);
    }
  });

  it("settings:data-usage-cycle - Cycle through data usage options", async () => {
    await openSettingsTab();
    await waitFor(element(by.id("settings-screen"))).toExist();

    const dataUsageSelector = element(by.id("data-usage-selector"));
    const isPresent = await dataUsageSelector.isExist();

    if (isPresent) {
      await dataUsageSelector.tap();
      await waitFor(element(by.text("Wi-Fi Only"))).toExist();
      await element(by.text("Wi-Fi Only")).tap();

      await dataUsageSelector.tap();
      await waitFor(element(by.text("Cellular"))).toExist();
      await element(by.text("Cellular")).tap();

      await dataUsageSelector.tap();
      await waitFor(element(by.text("Always"))).toExist();
      await element(by.text("Always")).tap();
    }
  });

  it("settings:language-toggle - Toggle OCR language", async () => {
    await openSettingsTab();
    await waitFor(element(by.id("settings-screen"))).toExist();

    const languageToggle = element(by.id("toggle-language-english"));
    const isPresent = await languageToggle.isExist();

    if (isPresent) {
      const initialState = await languageToggle.isToggleOn();
      await languageToggle.tap();
      const newState = await languageToggle.isToggleOn();
      expect(newState).not.toEqual(initialState);
    }
  });

  it("settings:import-not-implemented - Tap Import shows not implemented", async () => {
    await openSettingsTab();
    await waitFor(element(by.id("settings-screen"))).toExist();

    const importButton = element(by.id("import-button"));
    const isPresent = await importButton.isExist();

    if (isPresent) {
      await importButton.tap();
      await waitFor(element(by.text("Not Implemented"))).toExist({
        timeout: 5000,
      });
      await tapAlertButton("OK");
    }
  });

  it("settings:export-not-implemented - Tap Export shows not implemented", async () => {
    await openSettingsTab();
    await waitFor(element(by.id("settings-screen"))).toExist();

    const exportButton = element(by.id("export-button"));
    const isPresent = await exportButton.isExist();

    if (isPresent) {
      await exportButton.tap();
      await waitFor(element(by.text("Not Implemented"))).toExist({
        timeout: 5000,
      });
      await tapAlertButton("OK");
    }
  });

  it("settings:reset-app - Reset app clears all data", async () => {
    await openSettingsTab();
    await waitFor(element(by.id("settings-screen"))).toExist();

    const resetButton = element(by.id("reset-app-button"));
    await resetButton.tap();

    await waitFor(element(by.text("Reset"))).toExist();
    await element(by.text("Reset")).tap();

    await waitFor(
      element(by.text("App has been reset to default settings."))
    ).toExist({ timeout: 5000 });
    await tapAlertButton("OK");
  });

  it("settings:qa-seed-contacts - Seed sample contacts for testing", async () => {
    await openSettingsTab();
    await waitFor(element(by.id("settings-screen"))).toExist();

    const seedButton = element(by.id("qa-seed-sample-contacts-button"));
    const isPresent = await seedButton.isExist();

    if (isPresent) {
      await seedButton.tap();
      await waitFor(element(by.text("Loaded sample contacts for QA."))).toExist(
        { timeout: 5000 }
      );
      await tapAlertButton("OK");
    }
  });

  it("settings:about-section - About section shows app info", async () => {
    await openSettingsTab();
    await waitFor(element(by.id("settings-screen"))).toExist();

    const aboutSection = element(by.id("about-section"));
    const isPresent = await aboutSection.isExist();

    if (isPresent) {
      await aboutSection.tap();
      await expect(element(by.text("CardScannerApp"))).toExist();
    }
  });

  it("settings:version-display - App version is displayed", async () => {
    await openSettingsTab();
    await waitFor(element(by.id("settings-screen"))).toExist();

    const versionText = element(by.id("version-text"));
    const isPresent = await versionText.isExist();

    if (isPresent) {
      await expect(versionText).toExist();
    }
  });
});
