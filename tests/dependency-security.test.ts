/// <reference types="node" />
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), "package.json"), "utf8"),
);
const indexCss = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");

describe("shadcn stylesheet ownership and dependency boundary", () => {
  it("keeps the scaffold CLI development-only", () => {
    expect(packageJson.dependencies).not.toHaveProperty("shadcn");
    expect(packageJson.devDependencies).toHaveProperty("shadcn");
    expect(packageJson.scripts).not.toHaveProperty("typecheck:ignore");
  });

  it("imports source-owned styles and keeps the CLI available", () => {
    expect(indexCss).toContain('@import "./shadcn-tailwind.css";');
    const styles = readFileSync(
      resolve(process.cwd(), "src/shadcn-tailwind.css"),
      "utf8",
    );
    for (const required of [
      "@custom-variant data-open",
      "@custom-variant data-closed",
      "@custom-variant data-checked",
      "@custom-variant data-unchecked",
      "@custom-variant data-selected",
      "@custom-variant data-disabled",
      "@custom-variant data-active",
      "@custom-variant data-horizontal",
      "@custom-variant data-vertical",
      "@utility no-scrollbar",
      "@utility scroll-fade",
      "@utility shimmer",
    ])
      expect(styles).toContain(required);
  });
});
