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
  await page.getByLabel('Gig Title').fill('Navigation Test Gig')
  await page.getByLabel('Description').fill('This is a test description that is definitely long enough to pass validation rules.')
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

test.describe('Post a Gig v3 — Navigation', () => {

  test.describe('Back button navigation', () => {
    test('Step 1 has no Back button', async ({ page }) => {
      await goToStep(page, 1)
      await expect(page.getByRole('button', { name: 'Back' })).not.toBeVisible()
    })

    test('Step 2 Back returns to Step 1 with data preserved', async ({ page }) => {
      await goToStep(page, 2)
      await page.getByRole('button', { name: 'Back' }).click()

      await expect(page.getByText('Gig Information')).toBeVisible()
      await expect(page.getByLabel('Gig Title')).toHaveValue('Navigation Test Gig')
    })

    test('Step 3 Back returns to Step 2 with data preserved', async ({ page }) => {
      await goToStep(page, 3)
      await page.getByRole('button', { name: 'Back' }).click()

      await expect(page.getByText('When do you need this done?')).toBeVisible()
      await expect(page.locator('#start-date')).not.toHaveValue('')
      await expect(page.locator('#end-date')).not.toHaveValue('')
    })

    test('Step 4 Back returns to Step 3 with data preserved', async ({ page }) => {
      await goToStep(page, 4)
      await page.getByRole('button', { name: 'Back' }).click()

      await expect(page.getByText("What's your total budget?")).toBeVisible()
      await expect(page.getByLabel('Enter total budget ($)')).toHaveValue('500')
    })

    test('Step 5 Back returns to Step 4 with data preserved', async ({ page }) => {
      await goToStep(page, 5)
      await page.getByRole('button', { name: 'Back' }).click()

      await expect(page.getByText('Just a few more details!')).toBeVisible()
    })
  })

  test.describe('Edit buttons on Review step', () => {
    // SummaryCards render in order: Details(0), Timeline(1), Budget(2), Preferences(3)
    test('Edit Details navigates to Step 1 with data preserved', async ({ page }) => {
      await goToStep(page, 5)

      await page.getByRole('button', { name: 'Edit' }).nth(0).click()

      await expect(page.getByText('Gig Information')).toBeVisible()
      await expect(page.getByLabel('Gig Title')).toHaveValue('Navigation Test Gig')
    })

    test('Edit Timeline navigates to Step 2 with data preserved', async ({ page }) => {
      await goToStep(page, 5)

      await page.getByRole('button', { name: 'Edit' }).nth(1).click()

      await expect(page.getByText('When do you need this done?')).toBeVisible()
      await expect(page.locator('#start-date')).not.toHaveValue('')
    })

    test('Edit Budget navigates to Step 3 with data preserved', async ({ page }) => {
      await goToStep(page, 5)

      await page.getByRole('button', { name: 'Edit' }).nth(2).click()

      await expect(page.getByText("What's your total budget?")).toBeVisible()
      await expect(page.getByLabel('Enter total budget ($)')).toHaveValue('500')
    })

    test('Edit Preferences navigates to Step 4 with data preserved', async ({ page }) => {
      await goToStep(page, 5)

      await page.getByRole('button', { name: 'Edit' }).nth(3).click()

      await expect(page.getByText('Just a few more details!')).toBeVisible()
    })

    test('Edit buttons are disabled during publishing', async ({ page }) => {
      await goToStep(page, 5)

      await page.getByRole('button', { name: 'Publish Gig' }).click()

      const editButtons = page.getByRole('button', { name: 'Edit' })
      const count = await editButtons.count()
      for (let i = 0; i < count; i++) {
        await expect(editButtons.nth(i)).toBeDisabled()
      }

      await expect(page.getByRole('button', { name: 'Back' })).toBeDisabled()
    })
  })

  test.describe('Forward navigation with Continue', () => {
    test('Continue is disabled on Step 1 without valid data', async ({ page }) => {
      await goToStep(page, 1)
      await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled()
      await expect(page.getByText('Gig Information')).toBeVisible()
    })

    test('Full forward navigation through all steps', async ({ page }) => {
      await page.goto('/employer-web/hiring/new')

      // Pre-step
      await page.locator('textarea').fill('I need help with campus events')
      await page.locator('button', { hasText: 'Get Started' }).first().click()

      // Step 1
      await expect(page.getByText('Gig Information')).toBeVisible()
      await page.getByLabel('Gig Title').fill('Test Forward Nav')
      await page.getByLabel('Description').fill('A description long enough to pass the twenty character minimum.')
      await page.getByText('Collaboration').click()
      await page.getByRole('button', { name: 'Continue' }).click()

      // Step 2
      await expect(page.getByText('When do you need this done?')).toBeVisible()
      await page.locator('#start-date').fill(futureDate(14))
      await page.locator('#end-date').fill(futureDate(28))
      await page.getByRole('button', { name: 'Continue' }).click()

      // Step 3
      await expect(page.getByText("What's your total budget?")).toBeVisible()
      await page.getByLabel('Enter total budget ($)').fill('500')
      await page.getByRole('button', { name: 'Continue' }).click()

      // Step 4
      await expect(page.getByText('Just a few more details!')).toBeVisible()
      await page.getByLabel('Location').fill('Building A')
      await page.getByText('I am the owner and have authority to publish this gig').click()
      await page.getByRole('button', { name: 'Continue' }).click()

      // Step 5
      await expect(page.getByText('Test Forward Nav')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Publish Gig' })).toBeVisible()
    })
  })

  test.describe('Data preservation across navigation', () => {
    test('navigating back and forward preserves all field values', async ({ page }) => {
      await goToStep(page, 4)

      // Go back to Step 3
      await page.getByRole('button', { name: 'Back' }).click()
      await expect(page.getByText("What's your total budget?")).toBeVisible()
      await expect(page.getByLabel('Enter total budget ($)')).toHaveValue('500')

      // Go back to Step 2
      await page.getByRole('button', { name: 'Back' }).click()
      await expect(page.getByText('When do you need this done?')).toBeVisible()

      // Go back to Step 1
      await page.getByRole('button', { name: 'Back' }).click()
      await expect(page.getByLabel('Gig Title')).toHaveValue('Navigation Test Gig')

      // Go forward again — data should be preserved
      await page.getByRole('button', { name: 'Continue' }).click()
      await expect(page.locator('#start-date')).not.toHaveValue('')

      await page.getByRole('button', { name: 'Continue' }).click()
      await expect(page.getByLabel('Enter total budget ($)')).toHaveValue('500')
    })

    test('editing from Review and re-advancing preserves other step data', async ({ page }) => {
      await goToStep(page, 5)

      await expect(page.getByText('$500.00')).toBeVisible()

      // Edit budget (3rd Edit button, index 2)
      await page.getByRole('button', { name: 'Edit' }).nth(2).click()

      // Change budget
      await page.getByLabel('Enter total budget ($)').fill('750')
      await page.getByRole('button', { name: 'Continue' }).click()

      // Should be on Step 4 — Continue to get back to Review
      await expect(page.getByText('Just a few more details!')).toBeVisible()
      await page.getByRole('button', { name: 'Continue' }).click()

      // Back on Review — budget updated, other data preserved
      await expect(page.getByText('$750.00')).toBeVisible()
      await expect(page.getByText('Navigation Test Gig')).toBeVisible()
    })
  })
})
