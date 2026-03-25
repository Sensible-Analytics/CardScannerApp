/* global by, element, waitFor */

const {
  launchCleanApp,
  openScanTab,
  waitForVisible,
} = require("./helpers/app");

describe("Scanner OCR", () => {
  beforeEach(async () => {
    await launchCleanApp();
  });

  it("scans a mock business card and extracts contact info", async () => {
    await openScanTab();

    // Tap the mock scan button we added
    await waitForVisible(element(by.id("mock-scan-button")));
    await element(by.id("mock-scan-button")).tap();

    // Verify results view is shown
    await waitForVisible(element(by.id("results-view")));
    await expect(element(by.id("results-view"))).toExist();

    // The mock card has "John Doe", "+1 234 567 890" etc.
    // Let's check for some of that text in the extracted results
    await expect(element(by.id("extracted-text"))).toExist();

    // Check contact info fields
    await expect(element(by.text("John Doe"))).toExist();
    await expect(element(by.text("+1 234 567 890"))).toExist();
    await expect(element(by.text("Accountant"))).toExist();
  });
});
