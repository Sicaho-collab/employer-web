import { test, expect } from '@playwright/test'

function futureDate(daysFromNow: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().split('T')[0]
}

/** Fill a date input by setting value via JS and dispatching native events */
async function fillDate(page: import('@playwright/test').Page, selector: string, isoDate: string) {
  await page.locator(selector).evaluate((el: HTMLInputElement, val: string) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
    setter.call(el, val)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }, isoDate)
}

function toDisplay(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

test.describe('Post a Gig v3 — Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/employer-web/hiring/new')
  })

  test('completes the full wizard from pre-step to published (owner path)', async ({ page }) => {
    // ── Pre-step ──
    await expect(page.getByText('What do you need help with?')).toBeVisible()
    const textarea = page.locator('textarea')
    await textarea.fill('I need a student to help with campus event logistics and setup for our university open day')

    const getStartedBtn = page.locator('button', { hasText: 'Get Started' }).first()
    await expect(getStartedBtn).toBeEnabled()
    await getStartedBtn.click()

    // ── Step 1: Details ──
    await expect(page.getByText('Post a Gig')).toBeVisible()
    await expect(page.getByText('Gig Information')).toBeVisible()

    await page.getByLabel('Gig Title').fill('Campus Event Assistant')

    const descField = page.getByLabel('Description')
    await descField.fill('Help with setting up tables, chairs, signage, and directing attendees during the university open day event.')

    await page.getByText('Collaboration').click()
    await page.getByText('Communication & Influence').click()

    await page.getByRole('button', { name: 'Continue' }).click()

    // ── Step 2: Timeline ──
    await expect(page.getByText('When do you need this done?')).toBeVisible()

    const startDate = futureDate(14)
    const endDate = futureDate(21)

    await fillDate(page, '#start-date', startDate)
    await expect(page.locator('#start-date')).toHaveValue(startDate)
    await fillDate(page, '#end-date', endDate)
    await expect(page.locator('#end-date')).toHaveValue(endDate)

    await expect(page.getByText(/Gig duration: \d+ business day/)).toBeVisible()

    await page.getByRole('button', { name: 'Continue' }).click()

    // ── Step 3: Budget ──
    await expect(page.getByText("What's your total budget?")).toBeVisible()

    await page.getByLabel('Enter total budget ($)').fill('500')

    await expect(page.getByText('Budget Breakdown')).toBeVisible()
    await expect(page.getByText('Student payment', { exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Continue' }).click()

    // ── Step 4: Preferences ──
    await expect(page.getByText('Just a few more details!')).toBeVisible()

    // Wait for useEffect to set default locationType
    await expect(page.getByLabel('Location')).toBeVisible()
    await page.getByLabel('Location').fill('Building A, Level 3')

    await page.getByText('I am the owner and have authority to publish this gig').click()

    await page.getByRole('button', { name: 'Continue' }).click()

    // ── Step 5: Review & Publish ──
    await expect(page.getByText('Campus Event Assistant')).toBeVisible()
    await expect(page.getByText('Collaboration, Communication & Influence')).toBeVisible()
    await expect(page.getByText(toDisplay(startDate))).toBeVisible()
    await expect(page.getByText(toDisplay(endDate))).toBeVisible()
    await expect(page.getByText('$500.00')).toBeVisible()
    await expect(page.getByText(/On-Site/)).toBeVisible()
    await expect(page.getByText('I am the owner')).toBeVisible()

    await page.screenshot({ path: 'e2e/post-a-gig-v3/screenshots/happy-path-review.png', fullPage: true })

    await page.getByRole('button', { name: 'Publish Gig' }).click()
    await expect(page.getByText('Publishing...')).toBeVisible()

    await expect(page.getByText('Your gig has been published!')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Students can now discover and apply')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Go to Gig Management' })).toBeVisible()

    await page.screenshot({ path: 'e2e/post-a-gig-v3/screenshots/happy-path-success.png', fullPage: true })
  })

  test('completes flow with approval contact (non-owner)', async ({ page }) => {
    // Pre-step
    await page.locator('textarea').fill('Need help with data entry for our research project')
    await page.locator('button', { hasText: 'Get Started' }).first().click()

    // Step 1
    await page.getByLabel('Gig Title').fill('Data Entry Assistant')
    await page.getByLabel('Description').fill('Enter survey responses into our research database with accuracy and attention to detail.')
    await page.getByText('Analytical & Data Thinking').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Step 2
    await fillDate(page, '#start-date', futureDate(7))
    await fillDate(page, '#end-date', futureDate(30))
    await page.getByRole('button', { name: 'Continue' }).click()

    // Step 3
    await page.getByLabel('Enter total budget ($)').fill('300')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Step 4: Remote + approval contact
    await page.getByRole('button', { name: 'Remote' }).click()
    await page.getByLabel('Name').fill('Jane Smith')
    await page.getByLabel('Email').fill('jane.smith@university.edu')
    await page.getByLabel('Notes for your manager/team member').fill('Approved in our last team meeting')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Step 5
    await expect(page.getByText('Data Entry Assistant')).toBeVisible()
    await expect(page.getByText('Remote')).toBeVisible()
    await expect(page.getByText('Jane Smith (jane.smith@university.edu)')).toBeVisible()

    await page.getByRole('button', { name: 'Publish Gig' }).click()
    await expect(page.getByText('Your gig has been published!')).toBeVisible({ timeout: 5000 })
  })

  test('pre-step Enter key submits when valid', async ({ page }) => {
    const textarea = page.locator('textarea')
    await textarea.fill('Help me with student hiring for events')
    await textarea.press('Enter')

    await expect(page.getByText('Post a Gig')).toBeVisible()
    await expect(page.getByText('Gig Information')).toBeVisible()
  })

  test('pre-step Get Started is disabled when prompt too short', async ({ page }) => {
    const textarea = page.locator('textarea')
    const getStartedBtn = page.locator('button', { hasText: 'Get Started' }).first()

    await textarea.fill('Short')
    await expect(getStartedBtn).toBeDisabled()

    await textarea.fill('Help me wi')
    await expect(getStartedBtn).toBeEnabled()
  })

  test('shows character count on pre-step prompt', async ({ page }) => {
    await page.locator('textarea').fill('Hello World')
    await expect(page.getByText('11/500')).toBeVisible()
  })

  test('budget breakdown shows calculated values', async ({ page }) => {
    // Navigate to Step 3
    await page.locator('textarea').fill('I need help with a data project for my department')
    await page.locator('button', { hasText: 'Get Started' }).first().click()

    await page.getByLabel('Gig Title').fill('Data Project Helper')
    await page.getByLabel('Description').fill('Help with data analysis and reporting for quarterly business review.')
    await page.getByText('Analytical & Data Thinking').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await fillDate(page, '#start-date', futureDate(14))
    await fillDate(page, '#end-date', futureDate(28))
    await page.getByRole('button', { name: 'Continue' }).click()

    // Step 3
    await page.getByLabel('Enter total budget ($)').fill('1000')

    await expect(page.getByText('$120.00')).toBeVisible()
    await expect(page.getByText('$17.00')).toBeVisible()
    await expect(page.getByText('$13.70')).toBeVisible()
    await expect(page.getByText('$849.30')).toBeVisible()
    await expect(page.getByText(/can work up to/)).toBeVisible()

    await page.screenshot({ path: 'e2e/post-a-gig-v3/screenshots/budget-breakdown.png', fullPage: true })
  })
})
