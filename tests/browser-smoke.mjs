import { chromium, expect } from "@playwright/test";
import fs from "node:fs";
const base =
  process.env.QA_URL || "http://127.0.0.1:4174/react-project-proposal/";
const output = process.env.QA_OUTPUT || "playwright-report";
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
const report = { base, widths: [], wallPlateExamplesRemoved: false };
try {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: output + "/desktop.png", fullPage: true });
  await page.screenshot({ path: output + "/desktop-viewport.png" });
  await page
    .getByRole("link", { name: "Explore packages", exact: true })
    .click();
  await expect
    .poll(() =>
      page
        .locator("#packages")
        .evaluate((e) => Math.abs(e.getBoundingClientRect().top)),
    )
    .toBeLessThan(3);
  report.packageScroll = true;
  await page
    .getByRole("button", { name: "Toggle instant light", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Toggle dimmable light", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  const slider = page.getByRole("slider", { name: "Dimmable brightness" });
  await slider.focus();
  await page.keyboard.press("End");
  await expect(slider).toHaveAttribute("aria-valuenow", "100");
  await expect(
    page.getByRole("button", { name: "Toggle instant light", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  report.independentLights = true;
  await expect(page.locator("#finishes")).toHaveCount(0);
  await expect(page.getByRole("tablist")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Switch finishes" }),
  ).toHaveCount(0);
  await expect(page.locator("#packages .section-heading")).toBeVisible();
  report.wallPlateExamplesRemoved = true;
  report.serviceScope = true;
  await page.locator('a[href="#/?section=network-gold"]').click();
  await expect
    .poll(() =>
      page
        .locator("#network-gold")
        .evaluate((e) => Math.abs(e.getBoundingClientRect().top)),
    )
    .toBeLessThan(3);
  await page.getByRole("link", { name: "Network design", exact: true }).click();
  await expect(page.locator(".network-page .tier")).toHaveCount(3);
  await expect(page.locator(".network-page a.network-design-link")).toHaveCount(
    3,
  );
  for (const link of await page
    .locator(".network-page a.network-design-link")
    .all()) {
    await expect(link).toHaveAttribute("href", /^https:\/\/design\.ui\.com\//);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
  report.networkDesignLinks = true;
  await page
    .getByRole("link", { name: "Compare network options", exact: true })
    .click();
  await expect
    .poll(() =>
      page
        .locator("#network-options")
        .evaluate((e) => Math.abs(e.getBoundingClientRect().top)),
    )
    .toBeLessThan(3);
  await page.getByRole("link", { name: "3D home viewer", exact: true }).click();
  const frame = page.frameLocator("iframe");
  await frame.locator("canvas").waitFor({ timeout: 30000 });
  await expect
    .poll(() =>
      frame.locator("canvas").evaluate((e) => e.width > 0 && e.height > 0),
    )
    .toBe(true);
  await frame.getByRole("button", { name: "First", exact: true }).click();
  await expect(
    frame.getByRole("button", { name: "First", exact: true }),
  ).toHaveClass(/\bon\b/);
  for (const name of [
    "Top-down",
    "Plan",
    "Angled",
    "Cutaway walls",
    "Devices",
    "Labels",
  ])
    await frame.getByRole("button", { name, exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await frame
    .getByRole("button", { name: "Download GLB", exact: true })
    .click();
  const download = await downloadPromise;
  await download.saveAs(output + "/viewer.glb");
  const glb = fs.readFileSync(output + "/viewer.glb");
  if (glb.subarray(0, 4).toString() !== "glTF") throw new Error("Invalid GLB");
  report.viewer = {
    canvas: true,
    floorSwitch: true,
    controls: true,
    glbBytes: glb.length,
  };
  await page.screenshot({ path: output + "/viewer.png" });
  await page.getByRole("link", { name: "Proposal", exact: true }).click();
  await expect(page.locator("iframe")).toHaveCount(0);
  report.viewerTeardown = true;
  for (const width of [320, 390, 650, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const sizes = await page.evaluate(() => ({
      viewport: innerWidth,
      width: document.documentElement.scrollWidth,
    }));
    report.widths.push(sizes);
    if (sizes.width > sizes.viewport)
      throw new Error(`Overflow at ${width}: ${JSON.stringify(sizes)}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.screenshot({ path: output + "/mobile-viewport.png" });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Toggle navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Network design", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Network design", exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: /A home that feels/ }),
  ).toBeVisible();
  report.mobileMenuAndHistory = true;
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.evaluate(() => window.scrollTo(0, 2000));
  await expect(page.getByRole("button", { name: "Back to top" })).toBeVisible();
  await page.getByRole("button", { name: "Back to top" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Print proposal" })
    .click();
  await expect(page.locator(".print-document")).toBeVisible();
  await expect(page.locator(".demo-light")).toHaveCount(0);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".print-actions")).toBeHidden();
  await page.pdf({
    path: output + "/proposal-print.pdf",
    format: "A4",
    landscape: true,
    printBackground: true,
  });
  report.print = true;
  report.errors = errors;
  if (errors.length) throw new Error(errors.join("\n"));
  report.passed = true;
} finally {
  fs.writeFileSync(
    output + "/browser-smoke.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}
