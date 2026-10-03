import { describe, expect, it } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App";
import { validProjectUrl } from "../src/data";

describe("proposal experience", () => {
  it("presents the source tiers and matching comparison values", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Silver" })).toBeTruthy();
    expect(screen.getByText("$1,825")).toBeTruthy();
    expect(screen.getByText("$2,630")).toBeTruthy();
    expect(screen.getByText("$4,805")).toBeTruthy();
    expect(screen.getByText(/Cloud Gateway Max/)).toBeTruthy();
    expect(
      screen.getAllByText(
        "2×S, 1×L High Performance (Android), 1×XL High Performance (Android)",
      ),
    ).toHaveLength(2);
  });
  it("keeps proposal prices, subscription language and shared comparison values consistent", () => {
    render(<App />);
    expect(screen.getByText("$8,500")).toBeTruthy();
    expect(screen.getByText("$12,000")).toBeTruthy();
    expect(screen.getByText("$18,000")).toBeTruthy();
    expect(
      screen.getAllByText("Nabu Casa (subscription)").length,
    ).toBeGreaterThan(0);
  });
  it("selects finishes by tabs and carousel controls", async () => {
    render(<App />);
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: "End" });
    await waitFor(() =>
      expect(tabs[3].getAttribute("aria-selected")).toBe("true"),
    );
    expect(screen.getByText("1 / 2")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Next Solis colour/ }));
    expect(screen.getByText("2 / 2")).toBeTruthy();
  });
  it("keeps instant and dimmable demo lights independent", () => {
    render(<App />);
    const instant = screen.getByRole("button", {
      name: "Toggle instant light",
    });
    const dimmable = screen.getByRole("button", {
      name: "Toggle dimmable light",
    });
    fireEvent.click(instant);
    expect(instant.getAttribute("aria-pressed")).toBe("true");
    expect(dimmable.getAttribute("aria-pressed")).toBe("false");
    expect(
      screen.getByRole("status", { name: "Dimmable light state" }).textContent,
    ).toBe("Off");
    fireEvent.click(dimmable);
    expect(instant.getAttribute("aria-pressed")).toBe("true");
    expect(
      screen.getByRole("status", { name: "Dimmable light state" }).textContent,
    ).toBe("On");
  });
  it("routes to the local viewer and tears it down when leaving", async () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole("link", { name: "Explore the 3D home ↗" }),
    );
    expect(
      await screen.findByTitle(/interactive 3d home viewer/i),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: /^Proposal$/ }));
    await waitFor(() =>
      expect(screen.queryByTitle(/interactive 3d home viewer/i)).toBeNull(),
    );
  });
  it("shows safe network design states and rejects invalid project URLs", async () => {
    window.location.hash = "#/";
    render(<App />);
    fireEvent.click(screen.getByRole("link", { name: "Network design" }));
    expect(
      await screen.findByText(/project design link not configured/i),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: /UniFi Design Center/i })
        .getAttribute("href"),
    ).toBe("https://design.ui.com");
    expect(validProjectUrl("javascript:alert(1)")).toBeUndefined();
    expect(validProjectUrl("https://example.test/design")).toBe(
      "https://example.test/design",
    );
  });
});
