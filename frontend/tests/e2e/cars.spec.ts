/**
 * E2E Tests - Car Marketplace User Flows
 *
 * Tests the main user journeys:
 * - Landing page shows brands and featured cars
 * - Clicking brand filters cars
 * - Car detail page shows full info
 * - Inquiry form submission
 */

import { test, expect } from '@playwright/test'

test.describe('Car Marketplace User Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('landing page shows brands and featured cars', async ({ page }) => {
    // Verify home page loaded
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 10000 })

    // Verify brand list is visible
    const brandList = page.getByTestId('brand-list')
    await expect(brandList).toBeVisible()

    // Verify at least one brand button is present
    const brandButtons = brandList.locator('button')
    await expect(brandButtons.first()).toBeVisible()

    // Verify featured cars section exists
    await expect(page.getByText('Featured Vehicles')).toBeVisible()

    // Verify car grid is present (loading or with cars)
    const carGrid = page.getByTestId('car-grid')
    const carGridLoading = page.getByTestId('car-grid-loading')
    await expect(carGrid.or(carGridLoading)).toBeVisible()
  })

  test('clicking brand filters cars', async ({ page }) => {
    // Wait for home page
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 10000 })

    // Click on a brand (Ferrari - brand-1)
    const ferrariButton = page.getByTestId('brand-1')
    await expect(ferrariButton).toBeVisible({ timeout: 5000 })
    await ferrariButton.click()

    // Wait for navigation to brand page
    await expect(page.getByTestId('brand-page')).toBeVisible({ timeout: 10000 })

    // Verify we're on the brand page with filtered results
    await expect(page.getByText('Ferrari')).toBeVisible()

    // Verify car grid is present
    const carGrid = page.getByTestId('car-grid')
    const carGridLoading = page.getByTestId('car-grid-loading')
    const carGridEmpty = page.getByTestId('car-grid-empty')
    await expect(carGrid.or(carGridLoading).or(carGridEmpty)).toBeVisible()
  })

  test('car detail page shows full info', async ({ page }) => {
    // Wait for home page
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 10000 })

    // Wait for car grid to load
    const carGrid = page.getByTestId('car-grid')
    await expect(carGrid).toBeVisible({ timeout: 10000 })

    // Click on the first car card
    const firstCarCard = page.getByTestId('car-card-1')
    await expect(firstCarCard).toBeVisible({ timeout: 5000 })
    await firstCarCard.click()

    // Wait for car detail page to load
    await expect(page.getByTestId('car-detail')).toBeVisible({ timeout: 10000 })

    // Verify key elements are present
    await expect(page.getByText('Description')).toBeVisible()

    // Verify inquiry form is present
    await expect(page.getByTestId('inquiry-form')).toBeVisible()
    await expect(page.getByText('Interested in this car?')).toBeVisible()
  })

  test('inquiry form validates input', async ({ page }) => {
    // Navigate to a car detail page
    await page.goto('/car/1')
    await page.waitForLoadState('networkidle')

    // Wait for car detail to load
    await expect(page.getByTestId('car-detail')).toBeVisible({ timeout: 10000 })

    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: 'Send Inquiry' })
    await expect(submitButton).toBeVisible()
    await submitButton.click()

    // Verify validation errors appear
    await expect(page.getByText('Name is required')).toBeVisible()
  })

  test('inquiry form submission works', async ({ page }) => {
    // Navigate to a car detail page
    await page.goto('/car/1')
    await page.waitForLoadState('networkidle')

    // Wait for car detail to load
    await expect(page.getByTestId('car-detail')).toBeVisible({ timeout: 10000 })

    // Fill out the inquiry form
    const nameInput = page.getByLabel('Your Name')
    const emailInput = page.getByLabel('Email Address')
    const messageInput = page.getByLabel('Message')

    await nameInput.fill('John Smith')
    await emailInput.fill('john@example.com')
    await messageInput.fill('I am interested in this beautiful vintage car and would like more information.')

    // Submit the form
    const submitButton = page.getByRole('button', { name: 'Send Inquiry' })
    await submitButton.click()

    // Wait for success toast
    await expect(page.getByText('Inquiry Sent!')).toBeVisible({ timeout: 5000 })
  })

  test('can navigate between pages', async ({ page }) => {
    // Start at home page
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 10000 })

    // Click View All Vehicles
    await page.getByRole('button', { name: 'View All Vehicles' }).click()

    // Should be on brand/all page
    await expect(page.getByTestId('brand-page')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('All Vehicles')).toBeVisible()

    // Click back to home
    await page.getByRole('link', { name: 'Vintage Cars' }).click()

    // Should be back at home
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 10000 })
  })
})
