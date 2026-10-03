import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, it } from "vitest";
import App from "../src/App";
it("scrolls to a proposal section using a single hash and query parameter", async () => {
  render(<App />);
  const link = screen.getByRole("link", { name: "Explore packages" });
  expect(link).toHaveAttribute("href", "#/?section=packages");
  window.location.hash = link.getAttribute("href")!;
  fireEvent(window, new HashChangeEvent("hashchange"));
  await waitFor(() =>
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled(),
  );
  expect(document.querySelectorAll("#network-gold")).toHaveLength(1);
});
it("shows a recovery link for an unknown route", () => {
  window.location.hash = "#/missing";
  render(<App />);
  expect(
    screen.getByRole("heading", { name: "Page not found" }),
  ).toBeInTheDocument();
});
it("uses a focus-managed mobile navigation sheet", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Toggle navigation" }));
  expect(screen.getByRole("dialog")).toHaveAttribute(
    "data-slot",
    "sheet-content",
  );
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
});
