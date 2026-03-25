/* global by, element */

const {
  launchCleanApp,
  openContactsTab,
  resetAppDataFromSettings,
  seedSampleContacts,
  waitForVisible,
} = require("./helpers/app");

describe("Contact management", () => {
  beforeEach(async () => {
    await launchCleanApp();
    await resetAppDataFromSettings();
    await seedSampleContacts();
  });

  it("shows seeded contacts and opens the edit form", async () => {
    await openContactsTab();
    await waitForVisible(element(by.id("contact-item-qa-contact-jane-doe")));
    await waitForVisible(element(by.id("contact-item-qa-contact-carlos-ruiz")));

    await expect(
      element(by.id("contact-item-qa-contact-jane-doe"))
    ).toBeVisible();
    await expect(
      element(by.id("contact-item-qa-contact-carlos-ruiz"))
    ).toBeVisible();

    await element(by.id("contact-item-qa-contact-jane-doe")).tap();
    await expect(element(by.id("edit-contact-screen"))).toBeVisible();
    await expect(element(by.id("name-input"))).toHaveText("Jane Doe");
  });

  it("edits and deletes a seeded contact", async () => {
    await openContactsTab();
    await waitForVisible(element(by.id("contact-item-qa-contact-jane-doe")));
    await element(by.id("contact-item-qa-contact-jane-doe")).tap();

    await waitForVisible(element(by.id("name-input")));
    await element(by.id("name-input")).clearText();
    await element(by.id("name-input")).typeText("Jane QA");
    await element(by.id("save-button")).tap();
    await waitForVisible(
      element(by.text("Contact updated successfully!")),
      5000
    );
    await element(by.text("OK")).tap();

    await expect(
      element(by.id("contact-item-qa-contact-jane-doe"))
    ).toBeVisible();
    await expect(element(by.text("Jane QA"))).toBeVisible();

    await element(by.id("contact-item-qa-contact-jane-doe")).tap();
    await element(by.id("delete-button")).tap();
    await waitForVisible(element(by.text("Delete")), 5000);
    await element(by.text("Delete")).tap();

    await openContactsTab();
    await expect(
      element(by.id("contact-item-qa-contact-carlos-ruiz"))
    ).toBeVisible();
    await expect(element(by.text("Jane QA"))).not.toExist();
  });
});
