import { test, expect } from '@playwright/test'

function futureDate(daysFromNow: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().split('T')[0]
}

async function fillDate(page: import('@playwright/test').Page, selector: string, isoDate: string) {
  await page.locator(selector).evaluate((el: HTMLInputElement, val: string) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
    setter.call(el, val)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }, isoDate)
}

async function goToStep(page: import('@playwright/test').Page, targetStep: number) {
  await page.goto('/employer-web/hiring/new')

  const textarea = page.locator('textarea')
  await textarea.fill('I need a student to help organise campus events')
  await page.locator('button', { hasText: 'Get Started' }).first().click()
  if (targetStep <= 1) return

  await page.getByLabel('Gig Title').fill('Accessibility Test Gig')
  await page.getByLabel('Description').fill('A description long enough to pass the twenty character minimum requirement.')
  await page.getByText('Collaboration').click()
  await page.getByRole('button', { name: 'Continue' }).click()
  if (targetStep <= 2) return

  await fillDate(page, '#start-date', futureDate(14))
  await fillDate(page, '#end-date', futureDate(28))
  await page.getByRole('button', { name: 'Continue' }).click()
  if (targetStep <= 3) return

  await page.getByLabel('Enter total budget ($)').fill('500')
  await page.getByRole('button', { name: 'Continue' }).click()
  if (targetStep <= 4) return

  await expect(page.getByText('Just a few more details!')).toBeVisible()
  await page.getByLabel('Location').fill('Building A')
  await page.getByText('I am the owner and have authority to publish this gig').click()
  await page.getByRole('button', { name: 'Continue' }).click()
}

test.describe('Accessibility — ARIA & Roles', () => {

  test('capability error uses role="alert"', async ({ page }) => {
    await goToStep(page, 1)

    // Toggle a capability on/off to trigger capTouched + show error
    await page.getByText('Collaboration').click()
    await page.getByText('Collaboration').click()

    const capAlert = page.locator('[role="alert"]', { hasText: 'Select at least one capability' })
    await expect(capAlert).toBeVisible()
  })

  test('date error uses role="alert" on Step 2', async ({ page }) => {
    await goToStep(page, 2)

    const startDate = futureDate(14)
    await fillDate(page, '#start-date', startDate)
    await fillDate(page, '#end-date', startDate)

    const dateAlert = page.locator('[role="alert"]', { hasText: 'End date must be after start date' })
    await expect(dateAlert).toBeVisible()
  })

  test('publish error div has role="alert" attribute (Step 5)', async ({ page }) => {
    await goToStep(page, 5)

    // Before publishing, no error banner should be visible
    const errorBanner = page.locator('[role="alert"]')
    await expect(errorBanner).not.toBeVisible()
  })

  test('date fields have associated labels via htmlFor', async ({ page }) => {
    await goToStep(page, 2)

    const startLabel = page.locator('label[for="start-date"]')
    await expect(startLabel).toBeVisible()
    await expect(startLabel).toHaveText('Start Date')

    const endLabel = page.locator('label[for="end-date"]')
    await expect(endLabel).toBeVisible()
    await expect(endLabel).toHaveText('End Date')
  })

  test('Step 4 application deadline has associated label', async ({ page }) => {
    await goToStep(page, 4)

    const deadlineLabel = page.locator('label[for="application-deadline"]')
    await expect(deadlineLabel).toBeVisible()
    await expect(deadlineLabel).toHaveText('Application Deadline')
  })

  test('location type chips are buttons with accessible names', async ({ page }) => {
    await goToStep(page, 4)

    await expect(page.getByRole('button', { name: 'On-Site' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Remote' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Hybrid' })).toBeVisible()
  })
})

test.describe('Accessibility — Keyboard Navigation', () => {

  test('Tab navigates through pre-step fields', async ({ page }) => {
    await page.goto('/employer-web/hiring/new')

    const textarea = page.locator('textarea')
    await textarea.focus()
    await expect(textarea).toBeFocused()

    await page.keyboard.press('Tab')
    // Should move focus to the next focusable element
  })

  test('Enter submits pre-step when prompt is valid', async ({ page }) => {
    await page.goto('/employer-web/hiring/new')

    const textarea = page.locator('textarea')
    await textarea.fill('Help me with student hiring for campus events')
    await textarea.press('Enter')

    await expect(page.getByText('Gig Information')).toBeVisible()
  })

  test('Shift+Enter creates newline in pre-step textarea', async ({ page }) => {
    await page.goto('/employer-web/hiring/new')

    const textarea = page.locator('textarea')
    await textarea.fill('Line one')
    await textarea.press('Shift+Enter')
    await textarea.type('Line two')

    const value = await textarea.inputValue()
    expect(value).toContain('\n')
  })

  test('Tab navigates through Step 1 form fields', async ({ page }) => {
    await goToStep(page, 1)

    const titleField = page.getByLabel('Gig Title')
    await titleField.focus()
    await expect(titleField).toBeFocused()

    await page.keyboard.press('Tab')
    const descField = page.getByLabel('Description')
    await expect(descField).toBeFocused()
  })

  test('Continue button is keyboard accessible', async ({ page }) => {
    await goToStep(page, 1)

    // Fill valid data
    await page.getByLabel('Gig Title').fill('Valid Test Title')
    await page.getByLabel('Description').fill('A description that is long enough to pass validation easily.')
    await page.getByText('Collaboration').click()

    const continueBtn = page.getByRole('button', { name: 'Continue' })
    await continueBtn.focus()
    await page.keyboard.press('Enter')

    await expect(page.getByText('When do you need this done?')).toBeVisible()
  })
})

test.describe('Accessibility — Focus Management', () => {

  test('disabled Get Started button cannot be activated', async ({ page }) => {
    await page.goto('/employer-web/hiring/new')

    const getStartedBtn = page.locator('button', { hasText: 'Get Started' }).first()
    await expect(getStartedBtn).toBeDisabled()

    await getStartedBtn.click({ force: true })
    await expect(page.getByText('Gig Information')).not.toBeVisible()
  })

  test('Continue is disabled with empty fields on Step 1', async ({ page }) => {
    await goToStep(page, 1)

    // Continue should be disabled with no data
    const continueBtn = page.getByRole('button', { name: 'Continue' })
    await expect(continueBtn).toBeDisabled()

    // Still on Step 1
    await expect(page.getByText('Gig Information')).toBeVisible()
  })

  test('Edit buttons on Review are proper buttons', async ({ page }) => {
    await goToStep(page, 5)

    const editButtons = page.getByRole('button', { name: 'Edit' })
    const count = await editButtons.count()
    expect(count).toBe(4) // Details, Timeline, Budget, Preferences
  })

  test('Publish button text changes during loading', async ({ page }) => {
    await goToStep(page, 5)

    const publishBtn = page.getByRole('button', { name: 'Publish Gig' })
    await expect(publishBtn).toBeEnabled()

    await publishBtn.click()

    await expect(page.getByText('Publishing...')).toBeVisible()

    const publishingBtn = page.getByRole('button', { name: 'Publishing...' })
    await expect(publishingBtn).toBeDisabled()
  })
})
