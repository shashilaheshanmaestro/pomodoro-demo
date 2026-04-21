const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Ensure the stream dir exists for live screenshot previews
const streamDir = path.join(__dirname, '..', 'test-results', '_stream');
if (!fs.existsSync(streamDir)) fs.mkdirSync(streamDir, { recursive: true });

test.describe.configure({ mode: 'serial' });

test.describe('Pomodoro Timer', () => {
  test('initial state shows 25:00 and session count 0', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#timer-display')).toHaveText('25:00');
    await expect(page.locator('#session-count')).toHaveText('0');
    await page.screenshot({ path: path.join(streamDir, `${Date.now()}_initial.png`), fullPage: false });
  });

  test('Start begins the countdown', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-start');
    await page.waitForTimeout(1100);

    const timeRemaining = await page.evaluate(() => window.__pomodoroTest.getTimeRemaining());
    expect(timeRemaining).toBeLessThan(1500);

    const state = await page.evaluate(() => window.__pomodoroTest.getState());
    expect(state).toBe('running');
    await page.screenshot({ path: path.join(streamDir, `${Date.now()}_start.png`), fullPage: false });
  });

  test('Pause freezes the countdown', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-start');
    await page.waitForTimeout(1100);
    await page.click('#btn-pause');

    const timeRemaining = await page.evaluate(() => window.__pomodoroTest.getTimeRemaining());

    await page.waitForTimeout(1500);

    const timeRemainingAfterWait = await page.evaluate(() => window.__pomodoroTest.getTimeRemaining());
    expect(timeRemainingAfterWait).toBe(timeRemaining);

    const state = await page.evaluate(() => window.__pomodoroTest.getState());
    expect(state).toBe('paused');
    await page.screenshot({ path: path.join(streamDir, `${Date.now()}_pause.png`), fullPage: false });
  });

  test('Reset returns to 25:00 and stopped state', async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-start');
    await page.waitForTimeout(1100);
    await page.click('#btn-reset');

    await expect(page.locator('#timer-display')).toHaveText('25:00');

    const state = await page.evaluate(() => window.__pomodoroTest.getState());
    expect(state).toBe('stopped');
    await page.screenshot({ path: path.join(streamDir, `${Date.now()}_reset.png`), fullPage: false });
  });

  test('Session counter increments after a completed cycle', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.__pomodoroTest.setTimeRemaining(2));
    await page.click('#btn-start');
    await page.waitForTimeout(2500);

    const sessionCount = await page.evaluate(() => window.__pomodoroTest.getSessionCount());
    expect(sessionCount).toBe(1);

    await expect(page.locator('#session-count')).toHaveText('1');
    await expect(page.locator('#timer-display')).toHaveText('25:00');
    await page.screenshot({ path: path.join(streamDir, `${Date.now()}_session.png`), fullPage: false });
  });
});
