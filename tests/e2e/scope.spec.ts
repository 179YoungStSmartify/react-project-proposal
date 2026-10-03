import { test, expect, openProposal, navigate } from "./fixtures";
test("integration hardware exclusions and network inclusions remain explicit on screen and in print", async ({
  page,
}) => {
  await openProposal(page);
  const excluded =
    "Smart-home hardware is excluded and must be purchased or quoted separately.";
  const quantity =
    "Listed device quantities define integration scope, not hardware supply.";
  const network =
    "Network packages include the listed hardware. Cabling and installation are excluded and quoted separately.";
  for (const media of ["screen", "print"] as const) {
    await page.emulateMedia({ media });
    await expect(
      page.getByRole("heading", { name: "Smart-home integration packages" }),
    ).toBeVisible();
    await expect(page.locator("#packages .section-heading")).toContainText(
      "Consultation + integration services only.",
    );
    await expect(page.locator("#packages .section-heading")).toContainText(
      "Clients choose compatible hardware within their selected tier. Relays with normal light switches require Gold or Platinum. Dimming requires Platinum and compatible lights, confirmed through sample-stage testing.",
    );
    for (let index = 0; index < 3; index++) {
      const card = page.locator(".tier").nth(index);
      await expect(card).toContainText(excluded);
      await expect(card).toContainText(quantity);
      await expect(
        card.getByText("indicative integration", { exact: true }),
      ).toBeVisible();
      await expect(card).toContainText("Integration included");
      await expect(
        card
          .getByText("Relays with normal switches", { exact: true })
          .locator(".."),
      ).toContainText(index === 0 ? "Not included" : "Integration included");
      await expect(
        card.getByText("Dimming", { exact: true }).locator(".."),
      ).toContainText(
        index < 2
          ? "Not included"
          : "Included, subject to sample-stage testing",
      );
    }
    for (const tier of ["silver", "gold", "platinum"]) {
      const card = page.locator(`#network-${tier}`);
      await expect(card).toContainText(network);
      await expect(card).not.toContainText(excluded);
      await expect(
        card.getByText("indicative hardware", { exact: true }),
      ).toBeVisible();
    }
    const row = page.getByRole("row").filter({
      has: page.getByRole("rowheader", {
        name: "Smart-home hardware supply",
        exact: true,
      }),
    });
    await expect(
      row.getByRole("cell", {
        name: "Excluded — supplied separately",
        exact: true,
      }),
    ).toHaveCount(3);
    await expect(page.locator("footer")).toContainText(excluded);
    await expect(page.locator("footer")).toContainText(network);
    await expect(page.locator("#finishes")).toContainText(
      "These switches are not included in the integration price.",
    );
    await expect(page.locator("#finishes")).toContainText(
      "These Clipsal ranges are examples, not mandatory hardware choices.",
    );
  }
  await page.emulateMedia({ media: "screen" });
  await navigate(page, "Network design");
  for (const media of ["screen", "print"] as const) {
    await page.emulateMedia({ media });
    await expect(page.locator("main > .section-heading")).toContainText(
      network,
    );
    await expect(page.locator(".tier")).toHaveCount(3);
    for (const card of await page.locator(".tier").all()) {
      await expect(card).toContainText(network);
      await expect(card).not.toContainText(excluded);
    }
  }
});
