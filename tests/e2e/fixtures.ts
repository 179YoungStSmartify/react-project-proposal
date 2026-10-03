import { test as base, expect, type Page } from "@playwright/test";
export const test = base.extend<{ errorGuard: void }>({
  errorGuard: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await use();
      if (errors.length)
        await testInfo.attach("browser-errors", {
          body: JSON.stringify(errors, null, 2),
          contentType: "application/json",
        });
      expect(errors, "browser console and uncaught errors").toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };
export async function openProposal(page: Page, hash = "") {
  await page.goto(`./${hash}`);
  await expect(
    page.getByRole("heading", { name: /A home that feels/ }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}
export async function expectSectionAtTop(page: Page, id: string) {
  await expect
    .poll(
      () =>
        page
          .locator(`#${id}`)
          .evaluate((element) => Math.abs(element.getBoundingClientRect().top)),
      {
        message: `${id} must scroll to viewport top, not merely change the URL`,
      },
    )
    .toBeLessThan(3);
}
export async function navigate(page: Page, label: string) {
  const mobile = page.getByRole("button", { name: "Toggle navigation" });
  if (await mobile.isVisible()) {
    await mobile.click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  } else
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: label, exact: true })
      .click();
}
