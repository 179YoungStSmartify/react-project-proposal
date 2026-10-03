import { expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import App from "../src/App";
import { comparisonRows, lightingTiers, networkTiers } from "../src/data";
import source from "../client/proposal-tiers.html?raw";
import readme from "../README.md?raw";
const included =
  "Listed wall-screen hardware and one smart-home hub (HA Green or mini PC) are included. Switches, relays and wall plates are excluded and purchased separately.";
const network =
  "Network packages include the listed hardware. Cabling and installation are excluded and quoted separately.";
it("names included core hardware and excluded client-selected lighting hardware", () => {
  render(<App />);
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".tier"));
  expect(cards).toHaveLength(6);
  for (const card of cards.slice(0, 3)) {
    expect(card).toHaveTextContent(included);
    expect(card).toHaveTextContent(
      "Consultation + installation + integration services.",
    );
    expect(within(card).getByText("Service package")).toBeVisible();
    expect(within(card).getByText("indicative package")).toBeVisible();
  }
  for (const card of cards.slice(3)) {
    expect(card).toHaveTextContent(network);
    expect(card).not.toHaveTextContent(included);
    expect(within(card).getByText("indicative hardware")).toBeVisible();
  }
  expect(
    screen.getByRole("heading", { name: "Smart-home service tiers" }),
  ).toBeVisible();
  expect(
    comparisonRows
      .find((row) => row[0] === "Smart-home hub hardware")
      ?.slice(1),
  ).toEqual([
    "Included — one hub (HA Green or mini PC)",
    "Included — one hub (HA Green or mini PC)",
    "Included — one hub (HA Green or mini PC)",
  ]);
  expect(
    comparisonRows
      .find((row) => row[0] === "Switches, relays and wall plates")
      ?.slice(1),
  ).toEqual([
    "Excluded — client supplied",
    "Excluded — client supplied",
    "Excluded — client supplied",
  ]);
  expect(
    lightingTiers.map(
      (t) => t.specs.find((row) => row[0] === "Wall screens")?.[1],
    ),
  ).toEqual([
    "2×S, 1×M, 1×L",
    "2×S, 2×L",
    "2×S, 1×L High Performance (Android), 1×XL High Performance (Android)",
  ]);
  for (const tier of lightingTiers)
    for (const label of ["Garage door", "Air conditioning"])
      expect(tier.specs.find((row) => row[0] === label)?.[1]).toBe(
        "Integration included",
      );
  expect(lightingTiers.map((t) => t.price)).toEqual([
    "$8,500",
    "$12,000",
    "$18,000",
  ]);
  expect(networkTiers.map((t) => t.price)).toEqual([
    "$1,825",
    "$2,630",
    "$4,805",
  ]);
});
it("keeps the derivative and docs aligned without restoring the removed gallery", () => {
  for (const text of [source, readme]) {
    expect(text).toContain(included);
    expect(text).toContain(network);
    expect(text).toMatch(/consultation \+ installation \+ integration/i);
    expect(text).not.toMatch(
      /smart-home hardware is excluded|quantities define integration scope, not hardware supply/i,
    );
  }
  expect(source).not.toContain("Full control, faster hardware, more sensors.");
  expect(source).not.toContain('<section class="finish-panel"');
  expect(source).not.toContain('id="finishImage"');
  expect(source).not.toContain("var finishRanges");
});
it("preserves tier constraints and network differentiation", () => {
  render(<App />);
  const choice =
    "Clients choose compatible hardware within their selected tier. Relays with normal light switches require Gold or Platinum. Dimming requires Platinum and compatible lights, confirmed through sample-stage testing.";
  expect(screen.getByText(choice)).toBeVisible();
  expect(
    lightingTiers.map(
      (t) =>
        t.specs.find((row) => row[0] === "Relays with normal switches")?.[1],
    ),
  ).toEqual(["Not included", "Integration included", "Integration included"]);
  expect(
    lightingTiers.map((t) => t.specs.find((row) => row[0] === "Dimming")?.[1]),
  ).toEqual([
    "Not included",
    "Not included",
    "Included, subject to sample-stage testing",
  ]);
  for (const text of [source, readme]) expect(text.includes(choice)).toBe(true);
});
