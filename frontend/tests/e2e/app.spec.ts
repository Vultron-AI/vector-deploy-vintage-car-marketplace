/**
 * E2E Tests - Vintage Car Marketplace
 *
 * These tests capture screenshots for visual validation
 * and verify the main user flows.
 */

import { test, expect } from '@playwright/test'
import { mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// DO NOT CHANGE THESE NAMES
const MAIN_PAGE_SCREENSHOT_NAME = 'MainPage'
const LANDING_PAGE_SCREENSHOT_NAME = 'LandingPage'

// Ensure screenshots directory exists (ESM-compatible)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const screenshotsDir = join(__dirname, '..', 'screenshots')
if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true })
}

test.describe('App E2E Tests', () => {
  /**
   * Landing Page - Home page with featured cars and brand list
   */
  test('captures LandingPage screenshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for the home page to load
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 10000 })

    // Capture screenshot
    await page.screenshot({
      path: join(screenshotsDir, LANDING_PAGE_SCREENSHOT_NAME + '.png'),
      fullPage: true,
    })

    // Verify key elements
    await expect(page.getByText('Vintage Car Marketplace')).toBeVisible()
    await expect(page.getByText('Browse by Brand')).toBeVisible()
    await expect(page.getByTestId('brand-list')).toBeVisible()
  })

  /**
   * Main Page - Same as landing for this app (no auth)
   */
  test('captures MainPage screenshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for the home page to load
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 10000 })

    // Capture screenshot
    await page.screenshot({
      path: join(screenshotsDir, MAIN_PAGE_SCREENSHOT_NAME + '.png'),
      fullPage: true,
    })

    // Verify featured cars section
    await expect(page.getByText('Featured Vehicles')).toBeVisible()
  })
})
