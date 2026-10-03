import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";
import App from "../src/App";
beforeEach(() => {
  window.location.hash = "#/";
});
it("offers a labelled brightness slider without toggling the instant light", () => {
  render(<App />);
  const slider = screen.getByRole("slider", { name: "Dimmable brightness" });
  expect(slider).toHaveAttribute("aria-valuenow", "65");
  fireEvent.keyDown(slider, { key: "Home" });
  expect(
    screen.getByRole("button", { name: "Toggle instant light" }),
  ).toHaveAttribute("aria-pressed", "false");
});
