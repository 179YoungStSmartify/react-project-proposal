import { test, expect, openProposal, navigate } from "./fixtures";
import { finishRanges } from "../../src/data";
test("screen and print preserve prices with neutral pricing wording", async ({
  page,
}) => {
  await openProposal(page);
  const check = async () => {
    await expect(page.locator("body")).not.toContainText(
      /\bGST\b|goods and services tax/i,
    );
    for (const price of [
      "$8,500",
      "$12,000",
      "$18,000",
      "$1,825",
      "$2,630",
      "$4,805",
    ])
      await expect(page.getByText(price, { exact: true })).toBeVisible();
    const network = [
      ["silver", "UDR7 · 2× U7 Pro APs · PoE+ switch", "$1,825"],
      [
        "gold",
        "Cloud Gateway Ultra · 4× U7 Pro APs · 2.5 GbE PoE+ switch",
        "$2,630",
      ],
      [
        "platinum",
        "Cloud Gateway Max · 4× U7 Pro APs · 3× G6 cameras · 2.5 GbE PoE+ switch",
        "$4,805",
      ],
    ];
    for (const [tier, kit, price] of network) {
      await expect(page.locator(`#network-${tier}`)).toContainText(kit);
      await expect(
        page.locator(`a[href="#/?section=network-${tier}"]`),
      ).toContainText(`${price} indicative hardware`);
    }
    await expect(page.locator("#network-platinum")).toContainText(
      "3× G6 + up to 2 TB local recording",
    );
    await expect(
      page.getByText(
        "Network pricing is hardware only, quoted separately from lighting.",
        { exact: false },
      ),
    ).toContainText("Cabling and installation are quoted at the home visit.");
    await expect(page.locator("footer")).toContainText(
      "Prices are confirmed in writing after the home visit",
    );
  };
  await check();
  await page.emulateMedia({ media: "print" });
  await check();
});
for (const range of finishRanges)
  test(`loads every ${range.name} finish and wraps the carousel`, async ({
    page,
  }) => {
    await openProposal(page);
    await page.getByRole("tab", { name: range.name, exact: true }).click();
    for (const [colour, path] of range.colours) {
      const image = page.locator(".carousel img:visible");
      await expect(image).toHaveAttribute(
        "alt",
        `Clipsal ${range.name} two-gang switch in ${colour}`,
      );
      await expect(image).toHaveAttribute(
        "src",
        `/react-project-proposal${path}`,
      );
      await expect
        .poll(() =>
          image.evaluate(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
        )
        .toBe(true);
      await page
        .getByRole("button", { name: `Next ${range.name} colour` })
        .click();
    }
    await expect(page.locator("figcaption:visible")).toContainText("1 /");
    await page
      .getByRole("button", { name: `Previous ${range.name} colour` })
      .click();
    await expect(page.locator("figcaption:visible")).toContainText(
      `${range.colours.length} / ${range.colours.length}`,
    );
  });
test("keyboard finish navigation resets the selected colour", async ({
  page,
}) => {
  await openProposal(page);
  const first = page.getByRole("tab", { name: "Iconic Styl", exact: true });
  await first.click();
  await page.getByRole("button", { name: "Next Iconic Styl colour" }).click();
  await first.focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "Solis", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("figcaption:visible")).toContainText("1 / 2");
  await page.keyboard.press("Home");
  await expect(first).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("figcaption:visible")).toContainText("1 / 3");
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
  await expect(
    page.getByText(/Project design link not configured/),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Visit UniFi Design Center ↗" }),
  ).toHaveAttribute("href", "https://design.ui.com");
});
