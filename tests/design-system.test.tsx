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
it("uses the shared accessible Radix slider for dimmable brightness", () => {
  render(<App />);
  expect(
    screen.getByRole("slider", { name: "Dimmable brightness" }),
  ).toHaveAttribute("data-slot", "slider-thumb");
});
