import { test, expect, openProposal, navigate } from "./fixtures";

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
      [
        "silver",
        "Dream Router (UDR) · 2× U7 Pro APs · Ultra 60W (USW-Ultra-60W) switch",
        "$1,825",
      ],
      [
        "gold",
        "Cloud Gateway Ultra (UCG-Ultra) · 4× U7 Pro APs · Flex 2.5G PoE (USW-Flex-2.5G-8-PoE) switch",
        "$2,630",
      ],
      [
        "platinum",
        "Cloud Gateway Max 2TB (UCG-Max-2TB) · 4× U7 Pro APs · 1× USW-Ultra + 1× Flex 2.5G PoE switch · 3× G6 cameras",
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
      "1× G6 Pro Dome, 1× G6 180 and 1× G6 Mini Dome; 2 TB model",
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
