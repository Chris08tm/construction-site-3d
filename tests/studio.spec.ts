import { expect, test } from '@playwright/test';

test('room features open inside the viewer and the floor plan lives in the planning section', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const studio = page.locator('#studio');
  await studio.scrollIntoViewIfNeeded();
  await expect(studio.locator('canvas')).toBeVisible();
  await expect(studio.locator('[data-materials]')).toHaveAttribute('data-materials', 'ready');
  await expect(studio.getByRole('button', { name: 'Explore Quartz countertops', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(studio.locator('#room-feature-detail')).toHaveCount(0);
  await expect(studio.getByText('02 / Explore the details')).toHaveCount(0);
  await studio.getByRole('button', { name: 'Explore Impact windows', exact: true }).click();
  await expect(studio.locator('.room-viewer #room-feature-detail')).toContainText('impact-rated glazing');
  await studio.getByRole('button', { name: 'Explore Quartz countertops', exact: true }).click();
  await expect(studio.getByRole('region', { name: 'Quartz countertops details' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(studio.locator('#room-feature-detail')).toHaveCount(0);
  await expect(studio.getByRole('button', { name: 'Explore Quartz countertops', exact: true })).toBeFocused();
  await studio.getByRole('button', { name: 'Explore Impact windows', exact: true }).click();
  const canvas = studio.locator('canvas');
  const marker = studio.getByRole('button', { name: 'Explore Impact windows', exact: true });
  const initial = await marker.boundingBox();
  await canvas.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(async () => (await marker.boundingBox())?.x).not.toBe(initial?.x);
  await studio.getByRole('button', { name: 'Reset camera view' }).click();
  await expect.poll(async () => Math.abs(((await marker.boundingBox())?.x ?? 0) - (initial?.x ?? 0))).toBeLessThan(1);
  await studio.screenshot({ path: testInfo.outputPath('studio-kitchen.png') });

  for (const [room, feature] of [['Bathroom', 'Walk-in shower'], ['Bedroom', 'Impact windows']]) {
    await studio.getByRole('button', { name: room, exact: true }).click();
    await expect(studio.locator('canvas')).toHaveAttribute('aria-label', new RegExp(room.toLowerCase()));
    await expect(studio.locator('#room-feature-detail')).toHaveCount(0);
    await studio.getByRole('button', { name: `Explore ${feature}`, exact: true }).click();
    await expect(studio.getByRole('region', { name: `${feature} details` })).toBeVisible();
    await expect(studio.locator('[data-materials]')).toHaveAttribute('data-materials', 'ready');
    await page.waitForTimeout(150);
    await studio.screenshot({ path: testInfo.outputPath(`studio-${room.toLowerCase()}.png`) });
  }
  await expect(studio.getByRole('button', { name: 'Blueprint', exact: true })).toHaveCount(0);
  await expect(studio.getByLabel('Sample house floor plan', { exact: true })).toHaveCount(0);
  const about = page.locator('#about');
  await expect(about.getByText('36′–0″')).toBeVisible();
  await expect(about.getByRole('button')).toHaveCount(0);
  await expect(about.getByRole('img', { name: /Sample one-bedroom house plan/ })).toBeVisible();
  await about.screenshot({ path: testInfo.outputPath('about-plan.png') });
  await expect(studio.locator('canvas')).toHaveAttribute('aria-label', /bedroom/);
  await expect(studio.getByRole('link', { name: 'Let’s plan your remodel' })).toHaveAttribute('href', '#contact');
  expect(errors).toEqual([]);
});

test('mobile studio fits the viewport and supports feature and blueprint controls', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const studio = page.locator('#studio');
  await studio.scrollIntoViewIfNeeded();
  await expect(studio.locator('canvas')).toBeVisible();
  await expect(studio.locator('[data-materials]')).toHaveAttribute('data-materials', 'ready');
  const viewer = studio.locator('.room-viewer');
  const viewerHeight = await viewer.evaluate(element => element.getBoundingClientRect().height);
  const canvasSize = await studio.locator('canvas').evaluate(element => ({ width: element.clientWidth, height: element.clientHeight }));
  const detailHeight = await studio.locator('#room-feature-detail').evaluate(element => element.clientHeight);
  await expect(studio.getByRole('region', { name: 'Quartz countertops details' })).toBeVisible();
  await expect(studio.getByRole('button', { name: 'Explore Quartz countertops', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await studio.getByRole('button', { name: 'Bedroom', exact: true }).click();
  await expect(studio.getByRole('region', { name: 'Impact windows details' })).toBeVisible();
  await studio.getByRole('button', { name: 'Explore Built-in storage', exact: true }).click();
  expect(await viewer.evaluate(element => element.getBoundingClientRect().height)).toBe(viewerHeight);
  await expect(studio.getByRole('region', { name: 'Built-in storage details' })).toBeVisible();
  expect(await studio.locator('canvas').evaluate(element => ({ width: element.clientWidth, height: element.clientHeight }))).toEqual(canvasSize);
  expect(await studio.locator('#room-feature-detail').evaluate(element => element.clientHeight)).toBe(detailHeight);
  await expect(studio.getByRole('button', { name: 'Explore Built-in storage', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await studio.screenshot({ path: testInfo.outputPath('studio-mobile.png'), animations: 'disabled' });
  await studio.getByRole('button', { name: 'Close feature details' }).click();
  await expect(studio.locator('#room-feature-detail')).toHaveCount(0);
  expect(await viewer.evaluate(element => element.getBoundingClientRect().height)).toBe(viewerHeight);
  expect(await studio.locator('canvas').evaluate(element => ({ width: element.clientWidth, height: element.clientHeight }))).toEqual(canvasSize);
  await studio.getByRole('button', { name: 'Explore Impact windows', exact: true }).click();
  await expect(studio.getByRole('region', { name: 'Impact windows details' })).toBeVisible();
  expect(await viewer.evaluate(element => element.getBoundingClientRect().height)).toBe(viewerHeight);
  await studio.getByRole('button', { name: 'Explore Impact windows', exact: true }).click();
  await expect(studio.locator('#room-feature-detail')).toHaveCount(0);
  const about = page.locator('#about');
  await expect(about.getByRole('button')).toHaveCount(0);
  await expect(about.getByRole('img', { name: /Sample one-bedroom house plan/ })).toBeVisible();
  await about.screenshot({ path: testInfo.outputPath('about-mobile-plan.png') });
  expect(await viewer.evaluate(element => element.getBoundingClientRect().height)).toBe(viewerHeight);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('floor plan and feature details remain available without WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]).startsWith('webgl')) return null;
      return original.apply(this, args);
    };
  });
  await page.goto('/');
  const studio = page.locator('#studio');
  await expect(studio.getByText('The 3D preview is unavailable', { exact: false })).toBeVisible();
  await studio.getByRole('button', { name: '01 · Quartz countertops', exact: true }).click();
  await expect(studio.getByRole('region', { name: 'Quartz countertops details' })).toBeVisible();
  await studio.getByRole('link', { name: 'view the sample floor plan' }).click();
  await expect(page.locator('#about').getByText('36′–0″')).toBeVisible();
});
