/* global by, element */

const {
  launchCleanApp,
  openContactsTab,
  openScanTab,
  openSettingsTab,
  waitForVisible,
} = require("./helpers/app");

describe("Navigation flows", () => {
  beforeEach(async () => {
    await launchCleanApp();
  });

  it("opens the primary tabs and their root screens", async () => {
    await openScanTab();
    await waitForVisible(element(by.id("ocr-profile-summary")));
    await expect(element(by.id("ocr-profile-summary"))).toExist();

    await openContactsTab();
    await waitForVisible(element(by.id("contacts-list")));
    await expect(element(by.id("contacts-list"))).toExist();

    await openSettingsTab();
    await waitForVisible(element(by.id("ocr-settings-section")));
    await expect(element(by.id("settings-screen"))).toExist();
    await expect(element(by.id("ocr-settings-section"))).toExist();
  });
});
