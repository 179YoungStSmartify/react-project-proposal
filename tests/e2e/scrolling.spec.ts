import {
  test,
  expect,
  openProposal,
  expectSectionAtTop,
  navigate,
} from "./fixtures";
test("Explore packages scrolls to the actual section", async ({ page }) => {
  await openProposal(page);
  await page
    .getByRole("link", { name: "Explore packages", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/\?section=packages$/);
  await expectSectionAtTop(page, "packages");
});
test("clicking an unchanged section link scrolls again", async ({ page }) => {
  await openProposal(page);
  const link = page.getByRole("link", {
    name: "Explore packages",
    exact: true,
  });
  await link.click();
  await expectSectionAtTop(page, "packages");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
  await link.click();
  await expectSectionAtTop(page, "packages");
});
for (const tier of ["silver", "gold", "platinum"])
  test(`comparison link scrolls to ${tier} network card`, async ({ page }) => {
    await openProposal(page);
    await page.locator(`a[href="#/?section=network-${tier}"]`).click();
    await expectSectionAtTop(page, `network-${tier}`);
    await expect(page.locator(`#network-${tier}`)).toHaveCount(1);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
    await page.locator(`a[href="#/?section=network-${tier}"]`).click();
    await expectSectionAtTop(page, `network-${tier}`);
  });
test("cross-page comparison mounts and scrolls the proposal", async ({
  page,
}) => {
  await openProposal(page);
  await navigate(page, "Network design");
  await page
    .getByRole("link", { name: "Compare network options", exact: true })
    .click();
  await expectSectionAtTop(page, "network-options");
});
test("section deep links work after reload", async ({ page }) => {
  await openProposal(page, "#/?section=network-gold");
  await expectSectionAtTop(page, "network-gold");
  await page.reload();
  await expectSectionAtTop(page, "network-gold");
});
test("back and forward restore section destinations", async ({ page }) => {
  await openProposal(page);
  await page
    .getByRole("link", { name: "Explore packages", exact: true })
    .click();
  await expectSectionAtTop(page, "packages");
  await navigate(page, "Network design");
  await expect(
    page.getByRole("heading", { name: "Network design", exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expectSectionAtTop(page, "packages");
  await page.goForward();
  await expect(
    page.getByRole("heading", { name: "Network design", exact: true }),
  ).toBeVisible();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
});
test("page navigation resets a scrolled page to the top", async ({ page }) => {
  await openProposal(page);
  await page.evaluate(() =>
    window.scrollTo({ top: 2000, behavior: "instant" }),
  );
  await navigate(page, "Network design");
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
});
test("back-to-top appears only after scrolling and returns to top", async ({
  page,
}) => {
  await openProposal(page);
  const top = page.getByRole("button", { name: "Back to top" });
  await expect(top).toBeHidden();
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
  await expect(top).toBeHidden();
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: "instant" }));
  await expect(top).toBeVisible();
  await top.click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
  await expect(top).toBeHidden();
});
test("skip link focuses main without breaking hash routing", async ({
  page,
}) => {
  await openProposal(page);
  const original = page.url();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(page).toHaveURL(original);
});
test("scroll CSS respects the current motion preference", async ({
  page,
}, testInfo) => {
  await openProposal(page);
  const reduced = testInfo.project.use.reducedMotion === "reduce";
  expect(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(reduced);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe(reduced ? "auto" : "smooth");
});
