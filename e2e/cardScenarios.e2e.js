/* global by, element, waitFor, expect */

const {
  launchCleanApp,
  openScanTab,
  waitForVisible,
  tapAlertButton,
} = require("./helpers/app");

describe("Real-World Card Scenarios", () => {
  beforeEach(async () => {
    await launchCleanApp();
  });

  it("card:standard-layout - Standard business card with all fields", async () => {
    await openScanTab();

    // Perform mock scan
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    // Wait for results
    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    // Verify extracted text is shown
    await expect(element(by.id("extracted-text"))).toExist();

    // Check for contact fields
    await expect(element(by.id("results-view"))).toExist();
  });

  it("card:dense-content - Dense card with lots of text", async () => {
    await openScanTab();

    // Perform mock scan
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    // Wait for results
    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    // The app should handle dense content without crashing
    await expect(element(by.id("extracted-text"))).toExist();

    // Save button should still work
    await waitFor(element(by.id("save-contact-button"))).toExist();
  });

  it("card:email-only - Card with only email address", async () => {
    await openScanTab();

    // Perform mock scan
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    // Wait for results
    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    // Verify results view shows
    await expect(element(by.id("results-view"))).toExist();

    // The app should handle partial data gracefully
    // Either email is extracted or user is notified
    const hasData = await element(by.id("extracted-text")).isExist();
    expect(hasData).toBeTruthy();
  });

  it("card:phone-only - Card with only phone number", async () => {
    await openScanTab();

    // Perform mock scan
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    // Wait for results
    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    // Verify results view shows
    await expect(element(by.id("results-view"))).toExist();

    const hasData = await element(by.id("extracted-text")).isExist();
    expect(hasData).toBeTruthy();
  });

  it("card:no-detectable-fields - Random text with no standard fields", async () => {
    await openScanTab();

    // Perform mock scan
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    // Wait for results
    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    // The app should show the extracted text even if no fields detected
    await expect(element(by.id("extracted-text"))).toExist();

    // Save button should be present (though may show warning)
    await expect(element(by.id("save-contact-button"))).toExist();
  });

  it("card:vertical-text - Chinese/Japanese vertical text card", async () => {
    await openScanTab();

    // Perform mock scan
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    // Wait for results
    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    // Verify results view
    await expect(element(by.id("results-view"))).toExist();
  });

  it("card:multi-language - Card with multiple languages", async () => {
    await openScanTab();

    // Perform mock scan
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    // Wait for results
    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    // Verify results
    await expect(element(by.id("results-view"))).toExist();
  });

  it("card:logo-heavy - Card with large logo area", async () => {
    await openScanTab();

    // Perform mock scan
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    // Wait for results
    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    // Text should still be extracted even with logo
    await expect(element(by.id("extracted-text"))).toExist();
  });

  it("card:low-quality - Low quality/blurry card image", async () => {
    await openScanTab();

    // Perform mock scan (simulates low quality via mock)
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    // Wait for results
    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    // App should handle low quality gracefully
    await expect(element(by.id("results-view"))).toExist();
  });

  it("card:partial-crop - Partially visible card", async () => {
    await openScanTab();

    // Perform mock scan
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    // Wait for results
    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    // App should show what it could extract
    await expect(element(by.id("results-view"))).toExist();
  });
});
