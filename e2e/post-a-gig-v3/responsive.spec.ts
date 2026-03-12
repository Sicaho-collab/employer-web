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

  await page.getByLabel('Gig Title').fill('Responsive Test Gig')
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

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
]

for (const viewport of VIEWPORTS) {
  test.describe(`Responsive @ ${viewport.name} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test('pre-step renders correctly', async ({ page }) => {
      await page.goto('/employer-web/hiring/new')

      await expect(page.getByText('What do you need help with?')).toBeVisible()
      await expect(page.locator('textarea')).toBeVisible()
      await expect(page.locator('button', { hasText: 'Get Started' }).first()).toBeVisible()

      await page.screenshot({
        path: `e2e/post-a-gig-v3/screenshots/pre-step-${viewport.name}.png`,
        fullPage: true,
      })
    })

    test('Step 1 renders all fields', async ({ page }) => {
      await goToStep(page, 1)

      await expect(page.getByText('Gig Information')).toBeVisible()
      // Use locator for input/textarea directly since getByLabel depends on label association
      await expect(page.locator('input[placeholder="e.g., Campus Event Setup Assistant"]')).toBeVisible()
      await expect(page.locator('textarea[placeholder="Describe what the student will be doing..."]')).toBeVisible()
      await expect(page.getByText('Capabilities').first()).toBeVisible()
      await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible()

      await page.screenshot({
        path: `e2e/post-a-gig-v3/screenshots/step1-${viewport.name}.png`,
        fullPage: true,
      })
    })

    test('Step 2 renders date fields', async ({ page }) => {
      await goToStep(page, 2)

      await expect(page.getByText('When do you need this done?')).toBeVisible()
      await expect(page.locator('label[for="start-date"]')).toBeVisible()
      await expect(page.locator('label[for="end-date"]')).toBeVisible()

      await expect(page.getByRole('button', { name: 'Back' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible()

      await page.screenshot({
        path: `e2e/post-a-gig-v3/screenshots/step2-${viewport.name}.png`,
        fullPage: true,
      })
    })

    test('Step 3 renders budget fields', async ({ page }) => {
      await goToStep(page, 3)

      await expect(page.getByText("What's your total budget?")).toBeVisible()
      await expect(page.getByLabel('Enter total budget ($)')).toBeVisible()

      await page.screenshot({
        path: `e2e/post-a-gig-v3/screenshots/step3-${viewport.name}.png`,
        fullPage: true,
      })
    })

    test('Step 4 renders location chips and approval section', async ({ page }) => {
      await goToStep(page, 4)

      await expect(page.getByText('Just a few more details!')).toBeVisible()
      await expect(page.getByRole('button', { name: 'On-Site' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Remote' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Hybrid' })).toBeVisible()
      await expect(page.getByText('Approval Check')).toBeVisible()

      await page.screenshot({
        path: `e2e/post-a-gig-v3/screenshots/step4-${viewport.name}.png`,
        fullPage: true,
      })
    })

    test('Step 5 renders review cards', async ({ page }) => {
      await goToStep(page, 5)

      // Use more specific selectors to avoid matching stepper labels
      await expect(page.getByText('Responsive Test Gig')).toBeVisible() // from Details card
      await expect(page.getByText('$500.00')).toBeVisible() // from Budget card
      await expect(page.getByRole('button', { name: 'Publish Gig' })).toBeVisible()

      // Verify Edit buttons exist (4 cards = 4 Edit buttons)
      await expect(page.getByRole('button', { name: 'Edit' })).toHaveCount(4)

      await page.screenshot({
        path: `e2e/post-a-gig-v3/screenshots/step5-review-${viewport.name}.png`,
        fullPage: true,
      })
    })

    test('success state renders correctly', async ({ page }) => {
      await goToStep(page, 5)
      await page.getByRole('button', { name: 'Publish Gig' }).click()
      await expect(page.getByText('Your gig has been published!')).toBeVisible({ timeout: 5000 })

      await page.screenshot({
        path: `e2e/post-a-gig-v3/screenshots/success-${viewport.name}.png`,
        fullPage: true,
      })
    })
  })
}

// ── Mobile-specific tests ──

test.describe('Mobile-specific behavior (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('footer buttons stack vertically on mobile', async ({ page }) => {
    await goToStep(page, 2)

    const backBtn = page.getByRole('button', { name: 'Back' })
    const continueBtn = page.getByRole('button', { name: 'Continue' })

    await expect(backBtn).toBeVisible()
    await expect(continueBtn).toBeVisible()

    // On mobile, Continue appears first visually (flex-col-reverse puts it on top)
    const continueBound = await continueBtn.boundingBox()
    const backBound = await backBtn.boundingBox()
    if (continueBound && backBound) {
      expect(continueBound.y).toBeLessThan(backBound.y)
    }
  })

  test('capability chips wrap on mobile', async ({ page }) => {
    await goToStep(page, 1)

    const chipsContainer = page.locator('.flex.flex-wrap.gap-2').first()
    await expect(chipsContainer).toBeVisible()
    const box = await chipsContainer.boundingBox()
    if (box) {
      expect(box.width).toBeLessThanOrEqual(375)
    }
  })
})

// ── Desktop-specific tests ──

test.describe('Desktop-specific behavior (1280px)', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('date fields are side by side on desktop', async ({ page }) => {
    await goToStep(page, 2)

    const startField = page.locator('#start-date')
    const endField = page.locator('#end-date')

    const startBox = await startField.boundingBox()
    const endBox = await endField.boundingBox()

    if (startBox && endBox) {
      expect(Math.abs(startBox.y - endBox.y)).toBeLessThan(5)
    }
  })

  test('footer buttons are side by side on desktop', async ({ page }) => {
    await goToStep(page, 2)

    const backBtn = page.getByRole('button', { name: 'Back' })
    const continueBtn = page.getByRole('button', { name: 'Continue' })

    const backBox = await backBtn.boundingBox()
    const continueBox = await continueBtn.boundingBox()

    if (backBox && continueBox) {
      expect(Math.abs(backBox.y - continueBox.y)).toBeLessThan(5)
    }
  })
})
