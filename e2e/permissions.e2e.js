/* global by, element, waitFor, device, expect */

const { waitForVisible, tapAlertButton } = require("./helpers/app");

describe("Permission Handling", () => {
  beforeEach(async () => {
    // Launch with camera permission denied
    await device.launchApp({
      newInstance: true,
      launchArgs: {
        detoxDisableCamera: "true",
        detoxInitialTab: "Scan",
        detoxEnableSynchronization: 0,
      },
      permissions: {
        camera: "DENY",
        notifications: "NO",
        photos: "NO",
      },
    });

    await waitForVisible(element(by.id("scan-tab-button")));
  });

  it("perm:scanner-denied-view - Camera permission denied shows denied UI", async () => {
    // Wait for permission denied view to appear
    await waitFor(element(by.id("scanner-permission-view"))).toExist({
      timeout: 10000,
    });

    // Verify permission denied message is shown
    await expect(element(by.text("Camera Permission Required"))).toExist();
    await expect(
      element(by.text("Please grant camera permission to scan business cards"))
    ).toExist();
  });

  it("perm:grant-permission-button - Tap grant permission button", async () => {
    // Wait for permission denied view
    await waitFor(element(by.id("scanner-permission-view"))).toExist({
      timeout: 10000,
    });

    // Tap grant permission button
    await waitFor(element(by.id("grant-permission-button"))).toExist();
    await element(by.id("grant-permission-button")).tap();

    // Note: This will open system settings, which we can't fully automate in tests
    // But we can verify the button exists and is tappable
    await expect(element(by.id("grant-permission-button"))).toExist();
  });

  it("perm:denied-perists-after-relaunch - Permission state persists after relaunch", async () => {
    // First verify denied state
    await waitFor(element(by.id("scanner-permission-view"))).toExist({
      timeout: 10000,
    });

    // Relaunch app
    await device.launchApp({
      newInstance: true,
      launchArgs: {
        detoxDisableCamera: "true",
        detoxInitialTab: "Scan",
        detoxEnableSynchronization: 0,
      },
      permissions: {
        camera: "DENY",
      },
    });

    // Should still show denied view
    await waitFor(element(by.id("scanner-permission-view"))).toExist({
      timeout: 10000,
    });
    await expect(element(by.id("scanner-permission-view"))).toExist();
  });

  it("perm:granted-permission-shows-scanner - Granted permission shows scanner", async () => {
    // Launch with camera permission granted
    await device.launchApp({
      newInstance: true,
      launchArgs: {
        detoxDisableCamera: "true",
        detoxInitialTab: "Scan",
        detoxEnableSynchronization: 0,
      },
      permissions: {
        camera: "YES",
      },
    });

    await waitForVisible(element(by.id("scan-tab-button")));

    // Tap scan tab
    await element(by.id("scan-tab-button")).tap();

    // Should show scanner view (not permission denied)
    await waitFor(element(by.id("ocr-profile-summary"))).toExist({
      timeout: 10000,
    });
    await expect(element(by.id("ocr-profile-summary"))).toExist();
  });
});
