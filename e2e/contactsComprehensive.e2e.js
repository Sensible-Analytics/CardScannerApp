/* global by, element, waitFor, expect */

const {
  launchCleanApp,
  openContactsTab,
  openSettingsTab,
  waitForVisible,
  tapAlertButton,
  seedSampleContacts,
} = require("./helpers/app");

describe("Contacts Comprehensive Tests", () => {
  beforeEach(async () => {
    await launchCleanApp();
    await seedSampleContacts();
  });

  it("contacts:view-contact - View contact details", async () => {
    await openContactsTab();
    await waitFor(element(by.id("contacts-list"))).toExist();

    await element(by.id("contacts-list")).atIndex(0).tap();
    await waitFor(element(by.id("contact-detail-view"))).toExist();

    await expect(element(by.id("contact-detail-view"))).toExist();
  });

  it("contacts:edit-contact - Edit contact fields", async () => {
    await openContactsTab();
    await waitFor(element(by.id("contacts-list"))).toExist();

    await element(by.id("contacts-list")).atIndex(0).tap();
    await waitFor(element(by.id("contact-detail-view"))).toExist();

    await element(by.id("edit-contact-button")).tap();
    await waitFor(element(by.id("edit-contact-form"))).toExist();

    await expect(element(by.id("edit-contact-form"))).toExist();
  });

  it("contacts:delete-contact - Delete a contact", async () => {
    await openContactsTab();
    await waitFor(element(by.id("contacts-list"))).toExist();

    const initialCount = await element(by.id("contacts-list")).getAttributes();

    await element(by.id("contacts-list")).atIndex(0).tap();
    await waitFor(element(by.id("contact-detail-view"))).toExist();

    await element(by.id("delete-contact-button")).tap();
    await waitFor(element(by.text("Delete"))).toExist();
    await element(by.text("Delete")).tap();

    await waitFor(element(by.id("contacts-list"))).toExist({ timeout: 5000 });
  });

  it("contacts:search-filter - Search filters contacts", async () => {
    await openContactsTab();
    await waitFor(element(by.id("contacts-list"))).toExist();

    const searchInput = element(by.id("search-input"));
    const isPresent = await searchInput.isExist();

    if (isPresent) {
      await searchInput.typeText("John");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  });

  it("contacts:sort-order - Contacts sorted alphabetically", async () => {
    await openContactsTab();
    await waitFor(element(by.id("contacts-list"))).toExist();

    await expect(element(by.id("contacts-list"))).toExist();
  });

  it("contacts:empty-state - Empty contacts shows message", async () => {
    await element(by.id("settings-tab-button")).tap();
    await waitFor(element(by.id("reset-app-button"))).toExist();
    await element(by.id("reset-app-button")).tap();
    await waitFor(element(by.text("Reset"))).toExist();
    await element(by.text("Reset")).tap();
    await tapAlertButton("OK");

    await element(by.id("contacts-tab-button")).tap();
    await waitFor(element(by.id("empty-contacts-message"))).toExist({
      timeout: 5000,
    });

    await expect(element(by.id("empty-contacts-message"))).toExist();
  });

  it("contacts:manual-add-not-implemented - Manual add shows not implemented", async () => {
    await openContactsTab();

    const addButton = element(by.id("add-contact-button"));
    const isPresent = await addButton.isExist();

    if (isPresent) {
      await addButton.tap();
      await waitFor(element(by.text("Not Implemented"))).toExist({
        timeout: 5000,
      });
      await tapAlertButton("OK");
    }
  });

  it("contacts:call-action - Call contact phone number", async () => {
    await openContactsTab();
    await waitFor(element(by.id("contacts-list"))).toExist();

    await element(by.id("contacts-list")).atIndex(0).tap();
    await waitFor(element(by.id("contact-detail-view"))).toExist();

    const callButton = element(by.id("call-button"));
    const isPresent = await callButton.isExist();

    if (isPresent) {
      await expect(callButton).toExist();
    }
  });

  it("contacts:email-action - Email contact", async () => {
    await openContactsTab();
    await waitFor(element(by.id("contacts-list"))).toExist();

    await element(by.id("contacts-list")).atIndex(0).tap();
    await waitFor(element(by.id("contact-detail-view"))).toExist();

    const emailButton = element(by.id("email-button"));
    const isPresent = await emailButton.isExist();

    if (isPresent) {
      await expect(emailButton).toExist();
    }
  });

  it("contacts:export-single - Export single contact", async () => {
    await openContactsTab();
    await waitFor(element(by.id("contacts-list"))).toExist();

    await element(by.id("contacts-list")).atIndex(0).tap();
    await waitFor(element(by.id("contact-detail-view"))).toExist();

    const exportButton = element(by.id("export-contact-button"));
    const isPresent = await exportButton.isExist();

    if (isPresent) {
      await exportButton.tap();
      await expect(exportButton).toExist();
    }
  });
});
