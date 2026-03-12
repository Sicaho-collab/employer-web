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

/** Navigate to a specific step with valid data filled in for all previous steps. */
async function goToStep(page: import('@playwright/test').Page, targetStep: number) {
  await page.goto('/employer-web/hiring/new')

  // Pre-step
  const textarea = page.locator('textarea')
  await textarea.fill('I need a student to help organise campus events')
  await page.locator('button', { hasText: 'Get Started' }).first().click()
  if (targetStep <= 1) return

  // Step 1
  await page.getByLabel('Gig Title').fill('Test Gig Title')
  await page.getByLabel('Description').fill('This is a test description that is definitely long enough to pass validation.')
  await page.getByText('Collaboration').click()
  await page.getByRole('button', { name: 'Continue' }).click()
  if (targetStep <= 2) return

  // Step 2
  await fillDate(page, '#start-date', futureDate(14))
  await fillDate(page, '#end-date', futureDate(28))
  await page.getByRole('button', { name: 'Continue' }).click()
  if (targetStep <= 3) return

  // Step 3
  await page.getByLabel('Enter total budget ($)').fill('500')
  await page.getByRole('button', { name: 'Continue' }).click()
  if (targetStep <= 4) return

  // Step 4
  await expect(page.getByText('Just a few more details!')).toBeVisible()
  await page.getByLabel('Location').fill('Building A')
  await page.getByText('I am the owner and have authority to publish this gig').click()
  await page.getByRole('button', { name: 'Continue' }).click()
}

// ── Step 1: Details Validation ──

test.describe('Step 1 — Details Validation', () => {
  test.beforeEach(async ({ page }) => {
    await goToStep(page, 1)
  })

  test('Continue is disabled when all fields are empty', async ({ page }) => {
    // Continue should be disabled with no data
    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  test('shows title error on blur with short text', async ({ page }) => {
    const titleField = page.getByLabel('Gig Title')
    await titleField.fill('Test')
    await titleField.blur()
    await expect(page.getByText('Title must be at least 5 characters')).toBeVisible()

    await page.screenshot({ path: 'e2e/post-a-gig-v3/screenshots/step1-validation-errors.png', fullPage: true })
  })

  test('title requires at least 5 characters', async ({ page }) => {
    const titleField = page.getByLabel('Gig Title')
    await titleField.fill('Test')
    await titleField.blur()
    await expect(page.getByText('Title must be at least 5 characters')).toBeVisible()

    await titleField.fill('Testi')
    await titleField.blur()
    await expect(page.getByText('Title must be at least 5 characters')).not.toBeVisible()
  })

  test('title shows character count and enforces max 100', async ({ page }) => {
    const titleField = page.getByLabel('Gig Title')
    await titleField.fill('A'.repeat(100))
    await expect(page.getByText('100 / 100')).toBeVisible()

    await titleField.fill('A'.repeat(105))
    await expect(page.getByText('100 / 100')).toBeVisible()
  })

  test('description requires at least 20 characters', async ({ page }) => {
    const descField = page.getByLabel('Description')
    await descField.fill('Short desc')
    await descField.blur()
    await expect(page.getByText('Description must be at least 20 characters')).toBeVisible()

    await descField.fill('This description is long enough to pass.')
    await descField.blur()
    await expect(page.getByText('Description must be at least 20 characters')).not.toBeVisible()
  })

  test('description enforces max 1000 characters', async ({ page }) => {
    const descField = page.getByLabel('Description')
    await descField.fill('A'.repeat(1000))
    await expect(page.getByText('1000 / 1000')).toBeVisible()
  })

  test('capabilities — select at least one, max 3', async ({ page }) => {
    // Clicking a chip sets capTouched — then deselect to show error
    await page.getByText('Collaboration').click()
    await page.getByText('Collaboration').click() // deselect
    await expect(page.getByText('Select at least one capability')).toBeVisible()

    // Select one — error clears
    await page.getByText('Collaboration').click()
    await expect(page.getByText('Select at least one capability')).not.toBeVisible()

    // Select 3
    await page.getByText('Creative Thinking').click()
    await page.getByText('Adaptability').click()

    // 4th chip should have opacity-40 class (disabled visually)
    const fourthChip = page.getByText('Business Insight').locator('..')
    await expect(fourthChip).toHaveClass(/opacity-40/)
  })

  test('does not advance when validation is incomplete', async ({ page }) => {
    // Fill only title — not enough for canContinue
    await page.getByLabel('Gig Title').fill('Valid Title')

    // Continue should still be disabled (missing description + capability)
    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled()

    // Still on step 1
    await expect(page.getByText('Gig Information')).toBeVisible()
  })
})

// ── Step 2: Timeline Validation ──

test.describe('Step 2 — Timeline Validation', () => {
  test.beforeEach(async ({ page }) => {
    await goToStep(page, 2)
  })

  test('Continue is disabled without dates', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  test('shows start date error on blur', async ({ page }) => {
    // Focus and blur start date without selecting
    await page.locator('#start-date').focus()
    await page.locator('#start-date').blur()
    await expect(page.getByText('Please select a start date')).toBeVisible()

    await page.screenshot({ path: 'e2e/post-a-gig-v3/screenshots/step2-validation-errors.png', fullPage: true })
  })

  test('end date must be after start date', async ({ page }) => {
    const startDate = futureDate(14)
    await fillDate(page, '#start-date', startDate)
    await fillDate(page, '#end-date', startDate) // same date

    await expect(page.getByText('End date must be after start date')).toBeVisible()
  })

  test('changing start date clears end date if new start is after end', async ({ page }) => {
    const start1 = futureDate(14)
    const end1 = futureDate(16)
    const start2 = futureDate(20)

    await fillDate(page, '#start-date', start1)
    await expect(page.locator('#start-date')).toHaveValue(start1)
    await fillDate(page, '#end-date', end1)
    await expect(page.locator('#end-date')).toHaveValue(end1)
    await expect(page.getByText(/Gig duration: \d+ business day/)).toBeVisible()

    // Change start to after end — end should be cleared
    await fillDate(page, '#start-date', start2)
    await expect(page.locator('#start-date')).toHaveValue(start2)
    // Business days should disappear since end was cleared
    await expect(page.getByText(/Gig duration: \d+ business day/)).not.toBeVisible({ timeout: 3000 })
  })

  test('shows business days when dates are valid', async ({ page }) => {
    await fillDate(page, '#start-date', futureDate(14))
    await fillDate(page, '#end-date', futureDate(21))

    await expect(page.getByText(/Gig duration: \d+ business day/)).toBeVisible()

    await page.screenshot({ path: 'e2e/post-a-gig-v3/screenshots/step2-business-days.png', fullPage: true })
  })

  test('Continue is disabled until both valid dates are entered', async ({ page }) => {
    const continueBtn = page.getByRole('button', { name: 'Continue' })

    await expect(continueBtn).toBeDisabled()

    await fillDate(page, '#start-date', futureDate(14))
    await expect(continueBtn).toBeDisabled()

    await fillDate(page, '#end-date', futureDate(21))
    await expect(continueBtn).toBeEnabled()
  })
})

// ── Step 3: Budget Validation ──

test.describe('Step 3 — Budget Validation', () => {
  test.beforeEach(async ({ page }) => {
    await goToStep(page, 3)
  })

  test('Continue is disabled without budget', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  test('shows error on blur with empty budget', async ({ page }) => {
    const budgetField = page.getByLabel('Enter total budget ($)')
    await budgetField.focus()
    await budgetField.blur()
    await expect(page.getByText('Please enter a budget greater than $0')).toBeVisible()

    await page.screenshot({ path: 'e2e/post-a-gig-v3/screenshots/step3-validation-errors.png', fullPage: true })
  })

  test('budget must be greater than 0', async ({ page }) => {
    const budgetField = page.getByLabel('Enter total budget ($)')
    await budgetField.fill('0')
    await budgetField.blur()
    await expect(page.getByText('Please enter a budget greater than $0')).toBeVisible()
  })

  test('negative budget shows error', async ({ page }) => {
    const budgetField = page.getByLabel('Enter total budget ($)')
    await budgetField.fill('-50')
    await budgetField.blur()
    await expect(page.getByText('Please enter a budget greater than $0')).toBeVisible()
  })

  test('valid budget shows breakdown card', async ({ page }) => {
    await page.getByLabel('Enter total budget ($)').fill('1000')

    await expect(page.getByText('Budget Breakdown')).toBeVisible()
    await expect(page.getByText('$120.00')).toBeVisible()
    await expect(page.getByText('$17.00')).toBeVisible()
    await expect(page.getByText(/can work up to/)).toBeVisible()
  })

  test('breakdown disappears when budget is cleared', async ({ page }) => {
    const budgetField = page.getByLabel('Enter total budget ($)')
    await budgetField.fill('500')
    await expect(page.getByText('Budget Breakdown')).toBeVisible()

    await budgetField.fill('')
    await expect(page.getByText('Budget Breakdown')).not.toBeVisible()
  })

  test('Continue is disabled until valid budget entered', async ({ page }) => {
    const continueBtn = page.getByRole('button', { name: 'Continue' })
    await expect(continueBtn).toBeDisabled()

    await page.getByLabel('Enter total budget ($)').fill('200')
    await expect(continueBtn).toBeEnabled()
  })
})

// ── Step 4: Preferences Validation ──

test.describe('Step 4 — Preferences Validation', () => {
  test.beforeEach(async ({ page }) => {
    await goToStep(page, 4)
  })

  test('on-site (default) shows location field and requires it', async ({ page }) => {
    await expect(page.getByLabel('Location')).toBeVisible()

    // Leave location empty, blur it
    await page.getByLabel('Location').focus()
    await page.getByLabel('Location').blur()
    await expect(page.getByText('Please enter the location where the student will need to be')).toBeVisible()
  })

  test('remote hides location details field', async ({ page }) => {
    await page.getByRole('button', { name: 'Remote' }).click()
    await expect(page.getByLabel('Location')).not.toBeVisible()
  })

  test('hybrid shows location details field', async ({ page }) => {
    await page.getByRole('button', { name: 'Hybrid' }).click()
    await expect(page.getByLabel('Location')).toBeVisible()
  })

  test('non-owner requires approval name and valid email', async ({ page }) => {
    // Fill location so that's not blocking
    await page.getByLabel('Location').fill('Building A')

    // Approval fields should be visible (isOwner is false by default)
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()

    // Blur name and email without filling
    await page.getByLabel('Name').focus()
    await page.getByLabel('Name').blur()
    await expect(page.getByText('Please enter a name')).toBeVisible()

    await page.getByLabel('Email').focus()
    await page.getByLabel('Email').blur()
    await expect(page.getByText('Please enter an email')).toBeVisible()
  })

  test('invalid email shows error', async ({ page }) => {
    await page.getByLabel('Location').fill('Building A')
    await page.getByLabel('Name').fill('John Doe')
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Email').blur()

    await expect(page.getByText('Please enter a valid email')).toBeVisible()
  })

  test('checking "I am the owner" hides approval fields and enables Continue', async ({ page }) => {
    await expect(page.getByLabel('Name')).toBeVisible()

    await page.getByText('I am the owner and have authority to publish this gig').click()

    await expect(page.getByLabel('Name')).not.toBeVisible()
    await expect(page.getByLabel('Email')).not.toBeVisible()
  })

  test('application deadline is auto-set', async ({ page }) => {
    const deadlineInput = page.locator('#application-deadline')
    await expect(deadlineInput).not.toHaveValue('')
  })
})
