import { test, expect, openProposal, navigate } from "./fixtures";
import { comparisonRows, lightingTiers, networkTiers } from "../../src/data";

test("proposal screen renders current package prices and network data", async ({
  page,
}) => {
  await openProposal(page);
  await expect(page.locator("body")).not.toContainText(
    /\bGST\b|goods and services tax/i,
  );
  await expect(page.locator("#packages .tier .price strong")).toHaveText(
    lightingTiers.map((tier) => tier.price),
  );
  await expect(page.locator("#network-options .tier .price strong")).toHaveText(
    networkTiers.map((tier) => tier.price),
  );

  for (const tierData of networkTiers) {
    const card = page.locator(`#network-${tierData.key}`);
    await expect(card.locator("h3")).toHaveText(tierData.name);
    await expect(card.locator("dl > div")).toHaveCount(tierData.specs.length);
    for (const [index, [label, value]] of tierData.specs.entries()) {
      const row = card.locator("dl > div").nth(index);
      await expect(row.locator("dt")).toHaveText(label);
      await expect(row.locator("dd")).toHaveText(value);
    }
    if (!tierData.designUrl) throw new Error(`${tierData.key} design URL missing`);
    await expect(card.locator("a.network-design-link")).toHaveAttribute(
      "href",
      tierData.designUrl,
    );
  }

  const homeNetwork = comparisonRows.find((row) => row[0] === "Home network");
  const comparisonRow = page.getByRole("row").filter({
    has: page.getByRole("rowheader", { name: "Home network", exact: true }),
  });
  await expect(comparisonRow.getByRole("cell")).toHaveText(
    homeNetwork!.slice(1),
  );
});
test("brightness keyboard controls do not change either light toggle", async ({
  page,
}) => {
  await openProposal(page);
  const instant = page.getByRole("button", { name: "Toggle instant light" });
  const dim = page.getByRole("button", { name: "Toggle dimmable light" });
  await instant.click();
  const slider = page.getByRole("slider", { name: "Dimmable brightness" });
  await slider.focus();
  await page.keyboard.press("End");
  await expect(slider).toHaveAttribute("aria-valuenow", "100");
  await page.keyboard.press("Home");
  await expect(slider).toHaveAttribute("aria-valuenow", "0");
  await expect(instant).toHaveAttribute("aria-pressed", "true");
  await expect(dim).toHaveAttribute("aria-pressed", "false");
});
test("mobile menu traps focus, closes with Escape and returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openProposal(page);
  const menu = page.getByRole("button", { name: "Toggle navigation" });
  await menu.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((dialog) =>
        dialog.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(menu).toBeFocused();
  await navigate(page, "Proposal");
  await page.evaluate(() =>
    window.scrollTo({ top: 2000, behavior: "instant" }),
  );
  await navigate(page, "Proposal");
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await navigate(page, "Network design");
  await expect(
    page.getByRole("heading", { name: "Network design", exact: true }),
  ).toBeVisible();
});
test("no horizontal document overflow at narrow and wide widths", async ({
  page,
}) => {
  await openProposal(page);
  for (const width of [320, 390, 650, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await expect
      .poll(
        () =>
          page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth,
          ),
        { message: `document overflow at ${width}px` },
      )
      .toBeLessThanOrEqual(0);
  }
});
test("unknown routes recover and network integration stays honest", async ({
  page,
}) => {
  await page.goto("./#/missing");
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Return to proposal" }).click();
  await navigate(page, "Network design");
  for (const [name, shareId] of [
    ["View Silver network design ↗", "3decd510-ef03-4098-ac90-fc137c050a52"],
    ["View Gold network design ↗", "1f719bb6-db14-46b1-b2be-eba8edb180cd"],
    ["View Platinum network design ↗", "36118d48-fd86-46eb-9be2-9f6b8e65cd4f"],
  ]) {
    const link = page.getByRole("link", { name });
    await expect(link).toHaveAttribute("href", new RegExp(shareId));
    await expect(link).toHaveAttribute("target", "_blank");
  }
  await expect(page.locator(".network-page iframe")).toHaveCount(0);
});
