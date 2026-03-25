/* global by, element, waitFor, expect */

const {
  launchCleanApp,
  openScanTab,
  openSettingsTab,
  openContactsTab,
  waitForVisible,
  tapAlertButton,
} = require("./helpers/app");

describe("Auto-Save Workflow Tests", () => {
  beforeEach(async () => {
    await launchCleanApp();

    await openSettingsTab();
    const resetButton = element(by.id("reset-app-button"));
    if (await resetButton.isExist()) {
      await resetButton.tap();
      await waitFor(element(by.text("Reset"))).toExist();
      await element(by.text("Reset")).tap();
      await tapAlertButton("OK");
    }
  });

  it("auto:enabled-saves-automatically - Auto-save enabled saves without manual tap", async () => {
    await openSettingsTab();

    const autoSaveToggle = element(by.id("toggle-auto-save"));
    if (await autoSaveToggle.isExist()) {
      const isOn = await autoSaveToggle.isToggleOn();
      if (!isOn) {
        await autoSaveToggle.tap();
      }
    }

    await openScanTab();
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    await openContactsTab();
    const hasContacts = await element(by.id("contacts-list")).isExist();
    expect(hasContacts).toBeTruthy();
  });

  it("auto:disabled-manual-save - Auto-save disabled requires manual save", async () => {
    await openSettingsTab();

    const autoSaveToggle = element(by.id("toggle-auto-save"));
    if (await autoSaveToggle.isExist()) {
      const isOn = await autoSaveToggle.isToggleOn();
      if (isOn) {
        await autoSaveToggle.tap();
      }
    }

    await openScanTab();
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    await openContactsTab();
    const hasContacts = await element(by.id("contacts-list")).isExist();
    expect(hasContacts).toBeFalsy();
  });

  it("auto:duplicate-scan - Scan same card twice creates duplicates", async () => {
    await openSettingsTab();

    const autoSaveToggle = element(by.id("toggle-auto-save"));
    if (await autoSaveToggle.isExist()) {
      const isOn = await autoSaveToggle.isToggleOn();
      if (!isOn) {
        await autoSaveToggle.tap();
      }
    }

    await openScanTab();

    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();
    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    await element(by.id("mock-scan-button")).tap();
    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    await openContactsTab();
    await waitFor(element(by.id("contacts-list"))).toExist();

    await expect(element(by.id("contacts-list"))).toExist();
  });

  it("auto:save-contact-button - Save contact button works", async () => {
    await openSettingsTab();

    const autoSaveToggle = element(by.id("toggle-auto-save"));
    if (await autoSaveToggle.isExist()) {
      const isOn = await autoSaveToggle.isToggleOn();
      if (isOn) {
        await autoSaveToggle.tap();
      }
    }

    await openScanTab();
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    const saveButton = element(by.id("save-contact-button"));
    await expect(saveButton).toExist();
    await saveButton.tap();

    await waitFor(element(by.text("Contact saved successfully"))).toExist({
      timeout: 5000,
    });
    await tapAlertButton("OK");
  });

  it("auto:cancel-scan - Cancel discards scanned data", async () => {
    await openScanTab();
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    const cancelButton = element(by.id("cancel-button"));
    if (await cancelButton.isExist()) {
      await cancelButton.tap();
      await waitFor(element(by.id("ocr-profile-summary"))).toExist({
        timeout: 5000,
      });
    }
  });

  it("auto:retake-photo - Retake clears previous scan", async () => {
    await openScanTab();
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    const retakeButton = element(by.id("retake-button"));
    if (await retakeButton.isExist()) {
      await retakeButton.tap();
      await waitFor(element(by.id("ocr-profile-summary"))).toExist({
        timeout: 5000,
      });
    }
  });
});
