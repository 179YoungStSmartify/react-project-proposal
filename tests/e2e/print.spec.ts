import { test, expect } from "./fixtures";
import { comparisonRows, lightingTiers, networkTiers } from "../../src/data";

test("print actions from every app route open the generated proposal document", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("printCalls", "0");
    window.print = () => {
      sessionStorage.setItem(
        "printCalls",
        String(Number(sessionStorage.getItem("printCalls") ?? "0") + 1),
      );
    };
  });

  for (const route of ["#/", "#/network", "#/viewer"]) {
    await page.goto(`./${route}`);
    await page.evaluate(() => sessionStorage.setItem("printCalls", "0"));
    const mobileMenu = page.getByRole("button", {
      name: "Toggle navigation",
    });
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "Print proposal" })
        .click();
    } else {
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Print proposal" })
        .click();
    }

    await expect(page).toHaveURL(/#\/print$/);
    await expect(page.locator(".print-document")).toBeVisible();
    await expect(page.locator(".print-document h1")).toHaveCount(1);
    await expect(page.locator(".print-document .print-section")).toHaveCount(5);
    const pricingNote = page.locator(".print-pricing-note");
    await expect(pricingNote).toHaveCount(1);
    await expect(pricingNote).toContainText(/network/i);
    await expect(pricingNote).toContainText(/electrical/i);
    await expect(pricingNote).toContainText(/installation/i);
    await expect(pricingNote).toContainText(/not included|excluded/i);
    await expect(page.locator(".print-service-section .tier")).toHaveCount(3);
    await expect(page.locator(".print-network-section .tier")).toHaveCount(3);
    await expect(
      page.locator(".print-comparison-section tbody > tr"),
    ).toHaveCount(comparisonRows.length);
    await expect(page.locator(".print-document .price strong")).toHaveText(
      [...lightingTiers, ...networkTiers].map((tier) => tier.price),
    );
    await expect(page.locator(".demo-light")).toHaveCount(0);
    await expect(page.locator(".top")).toHaveCount(0);
    await expect(page.locator(".viewer-page iframe")).toHaveCount(0);
    await expect(page.locator(".network-page")).toHaveCount(0);
    await expect(
      page.evaluate(() => sessionStorage.getItem("printCalls")),
    ).resolves.toBe("0");
    await page.getByRole("button", { name: "Print / Save as PDF" }).click();
    await expect(
      page.evaluate(() => sessionStorage.getItem("printCalls")),
    ).resolves.toBe("1");

    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".print-actions")).toHaveCSS("display", "none");
    await expect(page.locator(".print-document")).toBeVisible();
    const pdf = await page.pdf({
      path: testInfo.outputPath("generated-proposal.pdf"),
      format: "A4",
      landscape: true,
      printBackground: true,
    });
    expect(pdf.toString("ascii", 0, 5)).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(10_000);
    await page.emulateMedia({ media: "screen" });
  }
});

test("printing a web-only route shows guidance instead of the website", async ({
  page,
}) => {
  for (const route of ["#/network", "#/viewer"]) {
    await page.goto(`./${route}`);
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".print-shortcut-warning")).toBeVisible();
    await expect(page.locator(".print-page")).toHaveCount(0);
    await expect(page.locator(".site-app > main")).toHaveCSS(
      "display",
      "none",
    );
    await page.emulateMedia({ media: "screen" });
  }
});
