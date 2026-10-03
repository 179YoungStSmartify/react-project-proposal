import { expect, it } from "vitest";
import { networkTiers, comparisonRows, lightingTiers } from "../src/data";
import sourceProposal from "../client/proposal-tiers.html?raw";
it("uses the approved network prices and precise hardware descriptions", () => {
  expect(networkTiers.map((t) => [t.name, t.price])).toEqual([
    ["Silver Network", "$1,825"],
    ["Gold Network", "$2,630"],
    ["Platinum Network", "$4,805"],
  ]);
  const specs = networkTiers.map((t) => Object.fromEntries(t.specs));
  expect(specs[0].Kit).toBe("UDR7 · 2× U7 Pro APs · PoE+ switch");
  expect(specs[0]["Gateway LAN"]).toBe("2.5 GbE");
  expect(specs[0]["IDS/IPS throughput"]).toBe("2.3 Gbps");
  expect(specs[1].Kit).toBe(
    "Cloud Gateway Ultra · 4× U7 Pro APs · 2.5 GbE PoE+ switch",
  );
  expect(specs[2].Kit).toBe(
    "Cloud Gateway Max · 4× U7 Pro APs · 3× G6 cameras · 2.5 GbE PoE+ switch",
  );
  expect(specs[2].Cameras).toBe("3× G6 + up to 2 TB local recording");
  expect(comparisonRows.find((r) => r[0] === "Home network")).toEqual([
    "Home network",
    "Silver Network — $1,825 indicative hardware",
    "Gold Network — $2,630 indicative hardware",
    "Platinum Network — $4,805 indicative hardware",
  ]);
  expect(lightingTiers.map((t) => t.price)).toEqual([
    "$8,500",
    "$12,000",
    "$18,000",
  ]);
  for (const tier of networkTiers)
    expect(sourceProposal).toContain(`<span class="amt">${tier.price}</span>`);
  for (const kit of specs.map((t) => t.Kit))
    expect(sourceProposal).toContain(kit);
});
