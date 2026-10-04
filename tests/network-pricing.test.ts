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
  expect(specs[0].Kit).toBe(
    "Dream Router (UDR) · 2× U7 Pro APs · Ultra 60W (USW-Ultra-60W) switch",
  );
  expect(specs[0]["Gateway LAN"]).toBe("1 GbE LAN");
  expect(specs[0]["IDS/IPS throughput"]).toBe("1 Gbps");
  expect(specs[1].Kit).toBe(
    "Cloud Gateway Ultra (UCG-Ultra) · 4× U7 Pro APs · Flex 2.5G PoE (USW-Flex-2.5G-8-PoE) switch",
  );
  expect(specs[2].Kit).toBe(
    "Cloud Gateway Max 2TB (UCG-Max-2TB) · 4× U7 Pro APs · 1× Ultra (USW-Ultra) + 1× Flex 2.5G PoE (USW-Flex-2.5G-8-PoE) · 3× G6 cameras",
  );
  expect(specs[2].Cameras).toBe(
    "1× G6 Pro Dome, 1× G6 180 and 1× G6 Mini Dome; 2 TB model",
  );
  expect(networkTiers.map((tier) => tier.designUrl)).toEqual([
    "https://design.ui.com/share/3decd510-ef03-4098-ac90-fc137c050a52#key=c23f7582-5f37-476f-bfa3-580eaf920915",
    "https://design.ui.com/share/1f719bb6-db14-46b1-b2be-eba8edb180cd#key=cf9d690b-f603-4f83-93d5-f0680878fbc3",
    "https://design.ui.com/share/36118d48-fd86-46eb-9be2-9f6b8e65cd4f#key=737f0add-e88e-4cd1-8b9e-a92fa1e370cf",
  ]);
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
