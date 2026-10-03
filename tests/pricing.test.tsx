import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";
import sourceProposal from "../client/proposal-tiers.html?raw";
import architecture from "../ARCHITECTURE.md?raw";
import readme from "../README.md?raw";
import design from "../DESIGN.md?raw";

it("uses neutral indicative pricing throughout the proposal and documentation", () => {
  render(<App />);
  for (const text of [
    document.body.textContent,
    sourceProposal,
    architecture,
    readme,
    design,
  ]) {
    expect(text).not.toMatch(/\bGST\b|goods and services tax/i);
  }
  for (const price of [
    "$8,500",
    "$12,000",
    "$18,000",
    "$1,825",
    "$2,630",
    "$4,805",
  ])
    expect(screen.getAllByText(price).length).toBeGreaterThan(0);
  expect(
    screen.getByText(
      "Network pricing is hardware only, quoted separately from lighting.",
      { exact: false },
    ),
  ).toBeVisible();
});
