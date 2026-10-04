import { describe, expect, it } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App";

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
  it("removes wall-plate examples while preserving the lighting demonstration", () => {
    render(<App />);
    expect(
      screen.queryByRole("heading", { name: "Switch finishes" }),
    ).toBeNull();
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.queryByAltText(/Clipsal.*switch/i)).toBeNull();
    expect(
      screen.getByRole("button", { name: "Toggle instant light" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Toggle dimmable light" }),
    ).toBeVisible();
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
  it("shows the corresponding external design on each network tier", async () => {
    window.location.hash = "#/";
    render(<App />);
    fireEvent.click(screen.getByRole("link", { name: "Network design" }));
    const links = [
      [
        "View Silver network design ↗",
        "https://design.ui.com/share/3decd510-ef03-4098-ac90-fc137c050a52#key=c23f7582-5f37-476f-bfa3-580eaf920915",
      ],
      [
        "View Gold network design ↗",
        "https://design.ui.com/share/1f719bb6-db14-46b1-b2be-eba8edb180cd#key=cf9d690b-f603-4f83-93d5-f0680878fbc3",
      ],
      [
        "View Platinum network design ↗",
        "https://design.ui.com/share/36118d48-fd86-46eb-9be2-9f6b8e65cd4f#key=737f0add-e88e-4cd1-8b9e-a92fa1e370cf",
      ],
    ];
    for (const [name, href] of links) {
      const link = await screen.findByRole("link", { name });
      expect(link.getAttribute("href")).toBe(href);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    }
    expect(
      screen.queryByText(/project design link not configured/i),
    ).toBeNull();
  });
});
