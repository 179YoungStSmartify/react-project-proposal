import { test, expect, openProposal, navigate } from "./fixtures";
test("included core hardware and excluded lighting hardware remain explicit on screen and in print", async ({
  page,
}) => {
  await openProposal(page);
  const included =
    "Listed wall-screen hardware and one smart-home hub are included: HA Green for Silver and Gold; mini PC for Platinum.";
  const excluded =
    "Switches, relays and wall plates are excluded and purchased separately.";
  const hubs = [
    "One HA Green included",
    "One HA Green included",
    "One mini PC included",
  ];
  const hubCells = [
    "Included — one HA Green",
    "Included — one HA Green",
    "Included — one mini PC",
  ];
  const quantities = [
    "2×S, 1×M, 1×L",
    "2×S, 2×L",
    "2×S, 1×L High Performance (Android), 1×XL High Performance (Android)",
  ];
  const network =
    "Network packages include the listed hardware. Cabling and installation are excluded and quoted separately.";
  for (const media of ["screen", "print"] as const) {
    await page.emulateMedia({ media });
    await expect(
      page.getByRole("heading", { name: "Smart-home service tiers" }),
    ).toBeVisible();
    await expect(page.locator("#packages .section-heading")).toContainText(
      "Consultation + installation + integration services.",
    );
    await expect(page.locator("#packages .section-heading")).toContainText(
      "Clients choose compatible hardware within their selected tier. Relays with normal light switches require Gold or Platinum. Dimming requires Platinum and compatible lights, confirmed through sample-stage testing.",
    );
    for (let index = 0; index < 3; index++) {
      const card = page.locator(".tier").nth(index);
      await expect(card).toContainText(excluded);
      await expect(card).toContainText(included);
      await expect(
        card.getByText("Wall screens", { exact: true }).locator(".."),
      ).toContainText(quantities[index]);
      await expect(
        card
          .getByText("Smart-home hub hardware", { exact: true })
          .locator(".."),
      ).toContainText(hubs[index]);
      await expect(
        card.getByText("indicative package", { exact: true }),
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
        name: "Switches, relays and wall plates",
        exact: true,
      }),
    });
    await expect(
      row.getByRole("cell", {
        name: "Excluded — client supplied",
        exact: true,
      }),
    ).toHaveCount(3);
    await expect(page.locator("#packages .section-heading")).toContainText(
      included,
    );
    await expect(page.locator("footer")).toContainText(included);
    await expect(page.locator("footer")).toContainText(excluded);
    const hubRow = page.getByRole("row").filter({
      has: page.getByRole("rowheader", {
        name: "Smart-home hub hardware",
        exact: true,
      }),
    });
    await expect(hubRow.getByRole("cell")).toHaveText(hubCells);
    for (const [hub, count] of [
      ["Included — one HA Green", 2],
      ["Included — one mini PC", 1],
    ] as const) {
      await expect(
        hubRow.getByRole("cell", { name: hub, exact: true }),
      ).toHaveCount(count);
    }
    await expect(page.locator("table caption")).toContainText("wall-screen");
    await expect(page.locator("footer")).toContainText(network);
    await expect(page.locator("#finishes")).toHaveCount(0);
    await expect(page.getByRole("tablist")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Switch finishes" }),
    ).toHaveCount(0);
    await expect(page.locator("footer")).toContainText(
      "Consultation + installation + integration services.",
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
