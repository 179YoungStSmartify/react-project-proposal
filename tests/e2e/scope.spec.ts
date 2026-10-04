import { test, expect, openProposal } from "./fixtures";
import {
  comparisonRows,
  lightingTiers,
  networkScopeNote,
  networkTiers,
} from "../../src/data";

async function expectTierGroup(
  page: import("@playwright/test").Page,
  groupSelector: string,
  tiers: typeof lightingTiers | typeof networkTiers,
) {
  const cards = page.locator(`${groupSelector} .tier`);
  await expect(cards).toHaveCount(tiers.length);

  for (const [index, tierData] of tiers.entries()) {
    const card = cards.nth(index);
    await expect(card.locator("h3")).toHaveText(tierData.name);
    await expect(card.locator(".price strong")).toHaveText(tierData.price);
    await expect(card.locator("dl > div")).toHaveCount(tierData.specs.length);

    for (const [specIndex, [label, value]] of tierData.specs.entries()) {
      const row = card.locator("dl > div").nth(specIndex);
      await expect(row.locator("dt")).toHaveText(label);
      await expect(row.locator("dd")).toHaveText(value);
    }
  }
}

test("proposal data and semantic structure render in the web and print views", async ({
  page,
}) => {
  await openProposal(page);
  await expect(page.locator("#packages .section-heading h2")).toBeVisible();
  await expectTierGroup(page, "#packages", lightingTiers);

  await page.goto("./#/network");
  await expect(page.locator(".network-page h1")).toBeVisible();
  await expectTierGroup(page, ".network-page", networkTiers);
  for (const card of await page.locator(".network-page .tier").all()) {
    await expect(card).toContainText(networkScopeNote);
    await expect(card.locator("a.network-design-link")).toHaveAttribute(
      "target",
      "_blank",
    );
  }

  await page.goto("./#/print");
  await expect(page.locator(".print-document")).toBeVisible();
  await expect(page.locator(".print-document h1")).toHaveCount(1);
  await expect(page.locator(".print-document .print-section")).toHaveCount(5);
  await expect(page.locator(".demo-light, .viewer-page, .top")).toHaveCount(0);
  await expectTierGroup(page, ".print-service-section", lightingTiers);
  await expectTierGroup(page, ".print-network-section", networkTiers);
  await expect(page.locator(".print-network-section")).toContainText(
    networkScopeNote,
  );
  await expect(
    page.locator(".print-comparison-section tbody > tr"),
  ).toHaveCount(comparisonRows.length);
  await expect(
    page.locator(".print-comparison-section table caption"),
  ).toHaveCount(0);
});
