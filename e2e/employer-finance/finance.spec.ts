import { test, expect } from '@playwright/test'

test.describe('Employer Finance Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/employer-web/finance')
  })

  // ── Page Load ──

  test('page loads with single payment table (no tabs)', async ({ page }) => {
    // Payment table should be visible
    await expect(page.locator('table')).toBeVisible()

    // No tab elements should exist
    await expect(page.getByRole('tab')).toHaveCount(0)

    // URL should be the leaf route with no child segments
    await expect(page).toHaveURL(/\/employer-web\/finance$/)
  })

  test('page wrapper has correct max-width', async ({ page }) => {
    const wrapper = page.locator('.max-w-\\[900px\\]')
    await expect(wrapper).toBeVisible()
  })

  // ── Summary Cards ──

  test('summary cards visible with AUD amounts', async ({ page }) => {
    await expect(page.getByText('Total Spend')).toBeVisible()
    await expect(page.getByText('Pending Payments')).toBeVisible()
    await expect(page.getByText('Paid This Month')).toBeVisible()

    // All summary card amounts should display AUD, not SGD
    const summarySection = page.locator('section').filter({ hasText: 'Total Spend' })
    await expect(summarySection).not.toContainText('SGD')
    await expect(summarySection.getByText(/AUD/).first()).toBeVisible()
  })

  // ── Filter Chips ──

  test.describe('filter chips', () => {
    const filters = ['All', 'Authorised', 'Paid', 'Failed', 'Refunded']

    test('all filter chips are visible', async ({ page }) => {
      for (const filter of filters) {
        await expect(page.getByRole('option', { name: filter })).toBeVisible()
      }
    })

    test('clicking "Authorised" filters the table', async ({ page }) => {
      await page.getByRole('option', { name: 'Authorised' }).click()

      // Table should only show Authorised rows
      const rows = page.locator('tbody tr')
      await expect(rows.first()).toBeVisible()

      const statusTags = page.locator('tbody').getByText('Authorised')
      await expect(statusTags.first()).toBeVisible()

      // Other statuses should not appear
      await expect(page.locator('tbody').getByText('Failed')).toHaveCount(0)
      await expect(page.locator('tbody').getByText('Refunded')).toHaveCount(0)
    })

    test('clicking "Paid" filters the table', async ({ page }) => {
      await page.getByRole('option', { name: 'Paid' }).click()

      const statusTags = page.locator('tbody').getByText('Paid')
      await expect(statusTags.first()).toBeVisible()

      await expect(page.locator('tbody').getByText('Failed')).toHaveCount(0)
    })

    test('clicking "Failed" filters the table', async ({ page }) => {
      await page.getByRole('option', { name: 'Failed' }).click()

      const statusTags = page.locator('tbody').getByText('Failed')
      await expect(statusTags.first()).toBeVisible()

      await expect(page.locator('tbody').getByText('Paid')).toHaveCount(0)
    })

    test('clicking "Refunded" filters the table', async ({ page }) => {
      await page.getByRole('option', { name: 'Refunded' }).click()

      const statusTags = page.locator('tbody').getByText('Refunded')
      await expect(statusTags.first()).toBeVisible()

      await expect(page.locator('tbody').getByText('Paid')).toHaveCount(0)
    })

    test('clicking "All" resets filter to show all statuses', async ({ page }) => {
      // First apply a filter
      await page.getByRole('option', { name: 'Paid' }).click()
      await expect(page.locator('tbody').getByText('Failed')).toHaveCount(0)

      // Reset to All
      await page.getByRole('option', { name: 'All' }).click()

      // Multiple status types should now be visible
      const rows = page.locator('tbody tr')
      await expect(rows).not.toHaveCount(0)
    })
  })

  // ── Search ──

  test.describe('search input', () => {
    test('filters by gig title', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i)
      await expect(searchInput).toBeVisible()

      await searchInput.fill('Data Analyst')
      await expect(page.locator('tbody').getByText('Data Analyst').first()).toBeVisible()
    })

    test('filters by payment ID', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i)
      await searchInput.fill('PAY-')

      const rows = page.locator('tbody tr')
      await expect(rows.first()).toBeVisible()
    })
  })

  // ── Sorting ──

  test.describe('column sorting', () => {
    test('sort by Amount column', async ({ page }) => {
      const amountHeader = page.getByRole('columnheader', { name: /Amount/i })
      await amountHeader.click()
      await expect(amountHeader).toHaveAttribute('aria-sort', 'ascending')

      await amountHeader.click()
      await expect(amountHeader).toHaveAttribute('aria-sort', 'descending')
    })

    test('sort by Status column', async ({ page }) => {
      const statusHeader = page.getByRole('columnheader', { name: /Status/i })
      await statusHeader.click()
      await expect(statusHeader).toHaveAttribute('aria-sort', 'ascending')

      await statusHeader.click()
      await expect(statusHeader).toHaveAttribute('aria-sort', 'descending')
    })

    test('sort by Date column', async ({ page }) => {
      const dateHeader = page.getByRole('columnheader', { name: /Date/i })
      await dateHeader.click()
      await expect(dateHeader).toHaveAttribute('aria-sort', 'ascending')

      await dateHeader.click()
      await expect(dateHeader).toHaveAttribute('aria-sort', 'descending')
    })
  })

  // ── Payment Detail Dialog ──

  test.describe('payment detail dialog', () => {
    test('row click opens payment detail dialog', async ({ page }) => {
      // Click the first data row
      await page.locator('tbody tr').first().click()

      // Dialog should appear with payment details heading
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      await expect(dialog.getByText('Payment Details')).toBeVisible()
    })

    test('dialog shows correct fee breakdown fields', async ({ page }) => {
      await page.locator('tbody tr').first().click()

      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()

      // Fee breakdown fields per employer-web conventions
      await expect(dialog.getByText('Student Payment (incl. super)')).toBeVisible()
      await expect(dialog.getByText('Alumable Service Fee (12%)')).toBeVisible()
      await expect(dialog.getByText('Processing Fee (1.7%)')).toBeVisible()
      await expect(dialog.getByText('GST (10% of fees)')).toBeVisible()
      await expect(dialog.getByText('Total Gig Cost')).toBeVisible()
    })

    test('dialog can be closed', async ({ page }) => {
      await page.locator('tbody tr').first().click()

      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()

      await dialog.getByRole('button', { name: /Close/i }).click()
      await expect(dialog).not.toBeVisible()
    })
  })

  // ── Pagination ──

  test.describe('pagination', () => {
    test('displays 10 rows per page', async ({ page }) => {
      const rows = page.locator('tbody tr')
      await expect(rows).toHaveCount(10)
    })

    test('next page button loads more rows', async ({ page }) => {
      // Click next page
      const nextButton = page.getByRole('button', { name: /next/i })
      await expect(nextButton).toBeVisible()

      await nextButton.click()

      // Rows should still be present on page 2
      const rows = page.locator('tbody tr')
      await expect(rows.first()).toBeVisible()
    })
  })

  // ── Currency ──

  test('all currency displays as AUD not SGD', async ({ page }) => {
    // The page should not contain SGD anywhere
    await expect(page.locator('body')).not.toContainText('SGD')

    // AUD amounts should be present in the table
    await expect(page.getByText(/AUD/).first()).toBeVisible()
  })

  // ── Status Tags ──

  test('status tags use sentence case', async ({ page }) => {
    // Status tags should use sentence case (e.g. "Paid" not "PAID")
    const tbody = page.locator('tbody')

    // At least one status tag should be visible
    const sentenceCaseStatuses = ['Authorised', 'Paid', 'Failed', 'Refunded']
    const visibleStatuses: string[] = []

    for (const status of sentenceCaseStatuses) {
      const count = await tbody.getByText(status, { exact: true }).count()
      if (count > 0) visibleStatuses.push(status)
    }

    expect(visibleStatuses.length).toBeGreaterThan(0)

    // Uppercase variants should NOT appear
    const uppercaseStatuses = ['AUTHORISED', 'PAID', 'FAILED', 'REFUNDED']
    for (const status of uppercaseStatuses) {
      await expect(tbody.getByText(status, { exact: true })).toHaveCount(0)
    }
  })
})
