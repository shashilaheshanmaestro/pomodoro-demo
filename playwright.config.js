// PHASE 1 DISCOVERY
// FRONTEND_DIR   : /Users/heshan/Desktop/claude-agents/pomodoro-demo
// PKG_MANAGER    : npm  (package-lock.json present)
// DEV_COMMAND    : npx serve . -p 3456 -s
// DEV_PORT       : 3456  (static file server)
// BASE_URL       : http://localhost:3456
// ROUTES         : / (single-page app)
// TEST_TARGETS   : #timer-display, #btn-start, #btn-pause, #btn-reset, #session-count

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  workers: 1,
  retries: 0,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'playwright-report/report.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3456',
    headless: true,
    trace: 'on',
    screenshot: 'on',
    video: 'off',
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npx serve . -p 3456 -s',
    url: 'http://localhost:3456',
    reuseExistingServer: true,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
