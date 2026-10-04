import { test, expect, openProposal, navigate } from "./fixtures";
import type { Page } from "@playwright/test";

async function expectAlignedGroups(
  page: Page,
  expectedGroups = [
    { specCount: 12, scopeNoteCount: 0 },
    { specCount: 9, scopeNoteCount: 1 },
  ],
  selector = ".cards",
) {
  const cardGroups = page.locator(selector);
  await expect(cardGroups).toHaveCount(expectedGroups.length);
  for (const [groupIndex, group] of (await cardGroups.all()).entries()) {
    await expect
      .poll(
        async () =>
          group.evaluate((element, { specCount, scopeNoteCount }) => {
            const cards = Array.from(
              element.querySelectorAll(":scope > .tier"),
            );
            if (cards.length !== 3) return Infinity;
            const rects = (selector: string) =>
              cards.map((card) =>
                Array.from(card.querySelectorAll(selector)).map((row) => {
                  const { top, height } = row.getBoundingClientRect();
                  return { top, height };
                }),
              );
            const selectors = [
              ".metal",
              ".tier-content > .eyebrow",
              "h3",
              ".tier-content > p:not(.small-note)",
              "dl > div",
              ".small-note",
              ".price",
            ];
            let error = 0;
            for (const selector of selectors) {
              const groups = rects(selector);
              const expectedCount =
                selector === "dl > div"
                  ? specCount
                  : selector === ".small-note"
                    ? scopeNoteCount
                    : 1;
              if (groups.some((rows) => rows.length !== expectedCount))
                return Infinity;
              for (let i = 0; i < groups[0].length; i++) {
                for (const rows of groups) {
                  error = Math.max(
                    error,
                    Math.abs(rows[i].height - groups[0][i].height),
                    Math.abs(rows[i].top - groups[0][i].top),
                  );
                }
              }
            }
            return error;
          }, expectedGroups[groupIndex]),
        {
          message:
            "corresponding card rows must share top positions and heights",
        },
      )
      .toBeLessThan(1);
  }
}

test("side-by-side service and network cards share every row height on screen and in print", async ({
  page,
}) => {
  await openProposal(page);
  for (const width of [1440, 1024, 901]) {
    await page.setViewportSize({ width, height: 1000 });
    await expectAlignedGroups(page);
  }
  await page.setViewportSize({ width: 1024, height: 1000 });
  const priceRow = page.locator("#network-platinum .price");
  const originalPriceHeight = await priceRow.evaluate(
    (row) => row.getBoundingClientRect().height,
  );
  await page.locator("#network-platinum .price span").evaluate((span) => {
    span.textContent += " — Price confirmed after the home visit.".repeat(5);
  });
  await expectAlignedGroups(page);
  expect(
    await priceRow.evaluate((row) => row.getBoundingClientRect().height),
  ).toBeGreaterThan(originalPriceHeight);
  await page.goto("./#/print");
  await page.emulateMedia({ media: "print" });
  await expectAlignedGroups(page);
  await page.emulateMedia({ media: "screen" });
  await page.goto("./#/network");
  await expectAlignedGroups(page, [{ specCount: 9, scopeNoteCount: 1 }]);
  await page.goto("./#/print");
  await expectAlignedGroups(
    page,
    [{ specCount: 9, scopeNoteCount: 1 }],
    ".print-network-section .cards",
  );
});

test("card row alignment adapts to wrapping and returns to compact stacked mobile rows", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openProposal(page);
  const cards = page.locator("#packages .tier");
  const silver = cards
    .nth(0)
    .getByText("Wall screens", { exact: true })
    .locator("..");
  const platinum = cards
    .nth(2)
    .getByText("Wall screens", { exact: true })
    .locator("..");
  const originalHeight = await platinum.evaluate(
    (row) => row.getBoundingClientRect().height,
  );
  await platinum.locator("dd").evaluate((dd) => {
    dd.textContent +=
      " — Compatibility and placement reviewed during the home visit. ".repeat(
        5,
      );
    dd.style.fontSize = "20px";
  });
  await expectAlignedGroups(page);
  const expandedHeight = await platinum.evaluate(
    (row) => row.getBoundingClientRect().height,
  );
  expect(expandedHeight).toBeGreaterThan(originalHeight);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(
      async () => {
        const s = await silver.boundingBox();
        const p = await platinum.boundingBox();
        return p!.height - s!.height;
      },
      { message: "stacked cards must not retain desktop row equalization" },
    )
    .toBeGreaterThan(20);
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
    )
    .toBeLessThanOrEqual(0);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expectAlignedGroups(page);
  await navigate(page, "Network design");
  await page
    .locator("#network-platinum")
    .getByText("Kit", { exact: true })
    .locator("..")
    .locator("dd")
    .evaluate((dd) => {
      dd.textContent +=
        " — Access point and camera placement reviewed during the home visit.".repeat(
          5,
        );
      dd.style.fontSize = "20px";
    });
  await expectAlignedGroups(page, [{ specCount: 9, scopeNoteCount: 1 }]);
  await page.goto("./#/print");
  await expectAlignedGroups(
    page,
    [{ specCount: 9, scopeNoteCount: 1 }],
    ".print-network-section .cards",
  );
});
