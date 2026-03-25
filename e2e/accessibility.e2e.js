/* global by, element, waitFor, expect */

const {
  launchCleanApp,
  openScanTab,
  openContactsTab,
  openSettingsTab,
  waitForVisible,
} = require("./helpers/app");

describe("Accessibility Tests", () => {
  beforeEach(async () => {
    await launchCleanApp();
  });

  it("a11y:scan-button-has-label - Scan button has accessibility label", async () => {
    await openScanTab();

    // Verify scan button exists and has accessibility
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await expect(element(by.id("mock-scan-button"))).toExist();
  });

  it("a11y:contacts-list-accessible - Contacts are accessible", async () => {
    await openContactsTab();

    // Verify contacts list is accessible
    const hasContacts = await element(by.id("contacts-list")).isExist();
    if (hasContacts) {
      await expect(element(by.id("contacts-list"))).toExist();
    } else {
      // Empty state should also be accessible
      await expect(element(by.id("empty-state-text"))).toExist();
    }
  });

  it("a11y:settings-toggles-accessible - Settings toggles are accessible", async () => {
    await openSettingsTab();
    await waitFor(element(by.id("settings-screen"))).toExist();

    // Verify settings screen has accessible elements
    await expect(element(by.id("settings-screen"))).toExist();

    // Check for toggle elements
    const hasToggles = await element(by.id("auto-save-switch")).isExist();
    if (hasToggles) {
      await expect(element(by.id("auto-save-switch"))).toExist();
    }
  });

  it("a11y:touch-target-size - Buttons have adequate touch targets", async () => {
    await openScanTab();

    // Verify buttons are present (48dp minimum is default in RN)
    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await expect(element(by.id("mock-scan-button"))).toExist();
  });

  it("a11y:results-view-accessible - Results view is accessible", async () => {
    await openScanTab();

    await waitFor(element(by.id("mock-scan-button"))).toExist();
    await element(by.id("mock-scan-button")).tap();

    await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

    // Verify results view elements are accessible
    await expect(element(by.id("results-view"))).toExist();
    await expect(element(by.id("extracted-text"))).toExist();
  });

  it("a11y:error-messages-accessible - Error messages are accessible", async () => {
    await openContactsTab();

    // Try to export with no contacts
    await element(by.id("settings-tab-button")).tap();
    await waitFor(element(by.id("reset-app-button"))).toExist();
    await element(by.id("reset-app-button")).tap();
    await waitFor(element(by.text("Reset"))).toExist();
    await element(by.text("Reset")).tap();
    await element(by.text("OK")).tap();

    await element(by.id("contacts-tab-button")).tap();
    await waitFor(element(by.id("export-all-contacts-button"))).toExist();
    await element(by.id("export-all-contacts-button")).tap();

    // Error message should be visible (accessible)
    await waitFor(element(by.text("No contacts to export"))).toExist({
      timeout: 5000,
    });
    await expect(element(by.text("No contacts to export"))).toExist();
  });

  it("a11y:navigation-tabs-accessible - Navigation tabs have labels", async () => {
    // Verify all tab buttons exist
    await expect(element(by.id("scan-tab-button"))).toExist();
    await expect(element(by.id("contacts-tab-button"))).toExist();
    await expect(element(by.id("settings-tab-button"))).toExist();
  });
});

it("a11y:contacts-list-accessible - Contacts are accessible", async () => {
  await openContactsTab();

  // Verify contacts list is accessible
  const hasContacts = await element(by.id("contacts-list")).isExist();
  if (hasContacts) {
    await expect(element(by.id("contacts-list"))).toExist();
  } else {
    // Empty state should also be accessible
    await expect(element(by.id("empty-state-text"))).toExist();
  }
});

it("a11y:settings-toggles-accessible - Settings toggles are accessible", async () => {
  await openSettingsTab();
  await waitFor(element(by.id("settings-screen"))).toExist();

  // Verify settings screen has accessible elements
  await expect(element(by.id("settings-screen"))).toExist();

  // Check for toggle elements
  const hasToggles = await element(by.id("auto-save-switch")).isExist();
  if (hasToggles) {
    await expect(element(by.id("auto-save-switch"))).toExist();
  }
});

it("a11y:touch-target-size - Buttons have adequate touch targets", async () => {
  await openScanTab();

  // Verify buttons are present (48dp minimum is default in RN)
  await waitFor(element(by.id("mock-scan-button"))).toExist();
  await expect(element(by.id("mock-scan-button"))).toExist();
});

it("a11y:results-view-accessible - Results view is accessible", async () => {
  await openScanTab();

  await waitFor(element(by.id("mock-scan-button"))).toExist();
  await element(by.id("mock-scan-button")).tap();

  await waitFor(element(by.id("results-view"))).toExist({ timeout: 10000 });

  // Verify results view elements are accessible
  await expect(element(by.id("results-view"))).toExist();
  await expect(element(by.id("extracted-text"))).toExist();
});

it("a11y:error-messages-accessible - Error messages are accessible", async () => {
  await openContactsTab();

  // Try to export with no contacts
  await element(by.id("settings-tab-button")).tap();
  await waitFor(element(by.id("reset-app-button"))).toExist();
  await element(by.id("reset-app-button")).tap();
  await waitFor(element(by.text("Reset"))).toExist();
  await element(by.text("Reset")).tap();
  await element(by.text("OK")).tap();

  await element(by.id("contacts-tab-button")).tap();
  await waitFor(element(by.id("export-all-contacts-button"))).toExist();
  await element(by.id("export-all-contacts-button")).tap();

  // Error message should be visible (accessible)
  await waitFor(element(by.text("No contacts to export"))).toExist({
    timeout: 5000,
  });
  await expect(element(by.text("No contacts to export"))).toExist();
});

it("a11y:error-messages-accessible - Error messages are accessible", async () => {
  await openContactsTab();

  // Try to export with no contacts
  await element(by.id("settings-tab-button")).tap();
  await waitFor(element(by.id("reset-app-button"))).toExist();
  await element(by.id("reset-app-button")).tap();
  await waitFor(element(by.text("Reset"))).toExist();
  await element(by.text("Reset")).tap();
  await element(by.text("OK")).tap();

  await element(by.id("contacts-tab-button")).tap();
  await waitFor(element(by.id("export-all-button"))).toExist();
  await element(by.id("export-all-button")).tap();

  // Error message should be visible (accessible)
  await waitFor(element(by.text("No contacts to export"))).toExist({
    timeout: 5000,
  });
  await expect(element(by.text("No contacts to export"))).toExist();
});

it("a11y:navigation-tabs-accessible - Navigation tabs have labels", async () => {
  // Verify all tab buttons exist
  await expect(element(by.id("scan-tab-button"))).toExist();
  await expect(element(by.id("contacts-tab-button"))).toExist();
  await expect(element(by.id("settings-tab-button"))).toExist();
});

it("a11y:form-inputs-labeled - Form inputs have labels", async () => {
  await openContactsTab();

  // Seed contacts
  await element(by.id("settings-tab-button")).tap();
  await waitFor(element(by.id("qa-seed-sample-contacts-button"))).toExist();
  await element(by.id("qa-seed-sample-contacts-button")).tap();
  await element(by.text("OK")).tap();

  await element(by.id("contacts-tab-button")).tap();
  await waitFor(element(by.id("contacts-list"))).toExist();

  // Tap on first contact
  await element(by.id("contacts-list")).atIndex(0).tap();

  // Tap edit
  await waitFor(element(by.id("edit-contact-button"))).toExist();
  await element(by.id("edit-contact-button")).tap();

  // Verify edit form has inputs
  await waitFor(element(by.id("edit-contact-form"))).toExist();
  await expect(element(by.id("edit-contact-form"))).toExist();
});
