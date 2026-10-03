import { defineConfig } from "@playwright/test";
const localUrl = "http://127.0.0.1:4180/react-project-proposal/";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 30000,
  expect: { timeout: 8000 },
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["junit", { outputFile: "test-results/e2e.xml" }],
  ],
  use: {
    baseURL: process.env.QA_URL || localUrl,
    browserName: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: { args: ["--enable-unsafe-swiftshader"] },
  },
  projects: [
    {
      name: "desktop",
      use: {
        viewport: { width: 1440, height: 1000 },
        reducedMotion: "no-preference",
      },
    },
    {
      name: "desktop-reduced-motion",
      use: { viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" },
    },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        reducedMotion: "no-preference",
      },
    },
    {
      name: "mobile-reduced-motion",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        reducedMotion: "reduce",
      },
    },
  ],
  webServer: process.env.QA_URL
    ? undefined
    : {
        command:
          "npm run build && npm run preview -- --host 127.0.0.1 --port 4180 --strictPort",
        url: localUrl,
        reuseExistingServer: false,
        timeout: 120000,
      },
});
