import { expect, it } from "vitest";
import { lightingTiers, comparisonRows } from "../src/data";
it("preserves the source remote-access comparison including Platinum integrations", () => {
  expect(comparisonRows.find((row) => row[0] === "Remote access")).toEqual([
    "Remote access",
    "Home Assistant App via Nabu Casa (subscription)",
    "Silver inclusions + integration into Google Home/Apple HomeKit",
    "Silver inclusions + integration into Google Home/Apple HomeKit",
  ]);
  expect(
    lightingTiers[1].specs.find(([label]) => label === "Remote access")?.[1],
  ).toBe("Nabu Casa (subscription)");
});
