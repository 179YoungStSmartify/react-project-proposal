import { expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import App from "../src/App";
import { comparisonRows, lightingTiers, networkTiers } from "../src/data";
import source from "../client/proposal-tiers.html?raw";
import readme from "../README.md?raw";
const excluded =
  "Smart-home hardware is excluded and must be purchased or quoted separately.";
const quantities =
  "Listed device quantities define integration scope, not hardware supply.";
const network =
  "Network packages include the listed hardware. Cabling and installation are excluded and quoted separately.";
it("distinguishes smart-home services excluding hardware from network hardware in every card and comparison", () => {
  render(<App />);
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".tier"));
  expect(cards).toHaveLength(6);
  for (const card of cards.slice(0, 3)) {
    expect(card).toHaveTextContent(excluded);
    expect(card).toHaveTextContent(quantities);
    expect(card).toHaveTextContent(
      "Consultation + installation + integration services.",
    );
    expect(within(card).getByText("Service package")).toBeVisible();
    expect(within(card).getByText("indicative services")).toBeVisible();
  }
  for (const card of cards.slice(3)) {
    expect(card).toHaveTextContent(network);
    expect(card).not.toHaveTextContent(excluded);
    expect(within(card).getByText("indicative hardware")).toBeVisible();
  }
  expect(
    screen.getByRole("heading", { name: "Smart-home service tiers" }),
  ).toBeVisible();
  expect(
    comparisonRows.find((row) => row[0] === "Smart-home hardware supply"),
  ).toEqual([
    "Smart-home hardware supply",
    "Excluded — supplied separately",
    "Excluded — supplied separately",
    "Excluded — supplied separately",
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
it("keeps the local source and documentation aligned with the confirmed scope", () => {
  for (const text of [source, readme]) {
    expect(text).toContain(excluded);
    expect(text).toContain(quantities);
    expect(text).toContain(network);
    expect(text).toMatch(/consultation \+ installation \+ integration/i);
  }
  expect(source).not.toContain("Full control, faster hardware, more sensors.");
  expect(source).not.toContain('<section class="finish-panel"');
  expect(source).not.toContain('id="finishImage"');
  expect(source).not.toContain("var finishRanges");
});
it("prices consultation, installation and integration with tier-constrained client hardware choice", () => {
  render(<App />);
  const choice =
    "Clients choose compatible hardware within their selected tier. Relays with normal light switches require Gold or Platinum. Dimming requires Platinum and compatible lights, confirmed through sample-stage testing.";
  expect(screen.getByText(choice)).toBeVisible();
  expect(
    screen.getByRole("heading", { name: "Smart-home service tiers" })
      .parentElement,
  ).toHaveTextContent("Consultation + installation + integration services.");
  expect(
    lightingTiers.map(
      (t) =>
        t.specs.find((row) => row[0] === "Relays with normal switches")?.[1],
    ),
  ).toEqual(["Not included", "Integration included", "Integration included"]);
  expect(
    comparisonRows.find((row) => row[0] === "Relays with normal switches"),
  ).toEqual([
    "Relays with normal switches",
    "Not included",
    "Integration included",
    "Integration included",
  ]);
  expect(
    lightingTiers.map((t) => t.specs.find((row) => row[0] === "Dimming")?.[1]),
  ).toEqual([
    "Not included",
    "Not included",
    "Included, subject to sample-stage testing",
  ]);
  for (const text of [source, readme]) expect(text.includes(choice)).toBe(true);
  for (const tier of lightingTiers) {
    expect(tier.summary).not.toMatch(/Clipsal|push-button-converted/);
    expect(tier.specs[0][1]).not.toMatch(/Clipsal|push-button-converted/);
  }
});
