import { render, screen } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";
import App from "../src/App";
beforeEach(() => {
  window.location.hash = "#/";
});
it("uses the shared shadcn Button primitive for interactive lighting controls", () => {
  render(<App />);
  expect(
    screen.getByRole("button", { name: "Toggle instant light" }),
  ).toHaveAttribute("data-slot", "button");
});
it("uses Radix-backed shadcn tabs for finish selection", () => {
  render(<App />);
  expect(screen.getByRole("tab", { name: "Iconic Styl" })).toHaveAttribute(
    "data-slot",
    "tabs-trigger",
  );
});
