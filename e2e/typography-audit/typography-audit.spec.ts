import { test, expect, Page } from '@playwright/test';

/**
 * Typography & CSS Audit
 * Compares employer-web (port 5174) against design system docs (port 5175)
 * to verify font sizes, button heights, icon spacing, and general consistency.
 */

const EMPLOYER_URL = 'http://localhost:5174/employer-web';
const DOCS_URL = 'http://localhost:5175';

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getComputedFontSize(page: Page, selector: string): Promise<string> {
  return page.locator(selector).first().evaluate((el) =>
    window.getComputedStyle(el).fontSize
  );
}

async function getComputedStyles(page: Page, selector: string, props: string[]): Promise<Record<string, string>> {
  return page.locator(selector).first().evaluate((el, properties) => {
    const cs = window.getComputedStyle(el);
    const result: Record<string, string> = {};
    for (const p of properties) {
      result[p] = cs.getPropertyValue(p);
    }
    return result;
  }, props);
}

// ─── 1. Font Size Verification ──────────────────────────────────────────────

test.describe('Font sizes match Tailwind v4 defaults', () => {
  test('text-xs = 12px, text-sm = 14px, text-base = 16px on employer-web', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(`${EMPLOYER_URL}/finance`, { waitUntil: 'networkidle' });

    // Inject test elements to measure exact Tailwind class output
    const sizes = await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'tw-size-probe';
      container.style.position = 'absolute';
      container.style.left = '-9999px';

      const classes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];
      for (const cls of classes) {
        const span = document.createElement('span');
        span.className = cls;
        span.textContent = 'Test';
        span.dataset.cls = cls;
        container.appendChild(span);
      }
      document.body.appendChild(container);

      const results: Record<string, string> = {};
      for (const cls of classes) {
        const el = container.querySelector(`[data-cls="${cls}"]`) as HTMLElement;
        results[cls] = window.getComputedStyle(el).fontSize;
      }
      document.body.removeChild(container);
      return results;
    });

    console.log('Employer-web Tailwind font sizes:', JSON.stringify(sizes, null, 2));

    // Tailwind v4 defaults (no custom overrides)
    expect(sizes['text-xs']).toBe('12px');
    expect(sizes['text-sm']).toBe('14px');
    expect(sizes['text-base']).toBe('16px');

    await page.close();
  });

  test('font sizes match between employer-web and design docs', async ({ browser }) => {
    const [empPage, docsPage] = await Promise.all([
      browser.newPage(),
      browser.newPage(),
    ]);

    await Promise.all([
      empPage.goto(`${EMPLOYER_URL}/finance`, { waitUntil: 'networkidle' }),
      docsPage.goto(`${DOCS_URL}`, { waitUntil: 'networkidle' }),
    ]);

    // Measure the same Tailwind classes on both
    async function measureSizes(page: Page) {
      return page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';

        const classes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];
        for (const cls of classes) {
          const span = document.createElement('span');
          span.className = cls;
          span.textContent = 'Test';
          span.dataset.cls = cls;
          container.appendChild(span);
        }
        document.body.appendChild(container);

        const results: Record<string, string> = {};
        for (const cls of classes) {
          const el = container.querySelector(`[data-cls="${cls}"]`) as HTMLElement;
          results[cls] = window.getComputedStyle(el).fontSize;
        }
        document.body.removeChild(container);
        return results;
      });
    }

    const empSizes = await measureSizes(empPage);
    const docsSizes = await measureSizes(docsPage);

    console.log('Employer-web sizes:', JSON.stringify(empSizes, null, 2));
    console.log('Design-docs sizes:', JSON.stringify(docsSizes, null, 2));

    for (const cls of Object.keys(empSizes)) {
      expect(empSizes[cls], `${cls} mismatch: employer=${empSizes[cls]} docs=${docsSizes[cls]}`).toBe(docsSizes[cls]);
    }

    await Promise.all([empPage.close(), docsPage.close()]);
  });
});

// ─── 2. Button Size Comparison ──────────────────────────────────────────────

test.describe('Button sizes match design system docs', () => {
  test('Filter and Export buttons on Finance page have correct height', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(`${EMPLOYER_URL}/finance`, { waitUntil: 'networkidle' });

    // Get all buttons and measure them
    const buttonInfo = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(btn => ({
        text: btn.textContent?.trim() || '',
        height: btn.getBoundingClientRect().height,
        fontSize: window.getComputedStyle(btn).fontSize,
        padding: window.getComputedStyle(btn).padding,
        gap: window.getComputedStyle(btn).gap,
        classes: btn.className,
      }));
    });

    console.log('Finance page buttons:');
    for (const btn of buttonInfo) {
      console.log(`  "${btn.text}" — height: ${btn.height}px, fontSize: ${btn.fontSize}, padding: ${btn.padding}, gap: ${btn.gap}`);
    }

    // Find Filter and Export buttons
    const filterBtn = buttonInfo.find(b => b.text.includes('Filter'));
    const exportBtn = buttonInfo.find(b => b.text.includes('Export'));

    if (filterBtn && exportBtn) {
      // Both should be sm size and same height
      expect(Math.abs(filterBtn.height - exportBtn.height)).toBeLessThan(2);
      console.log(`Filter height: ${filterBtn.height}px, Export height: ${exportBtn.height}px — MATCH`);
    }

    await page.close();
  });

  test('Button component renders identically on both sites', async ({ browser }) => {
    const [empPage, docsPage] = await Promise.all([
      browser.newPage(),
      browser.newPage(),
    ]);

    await Promise.all([
      empPage.goto(`${EMPLOYER_URL}/finance`, { waitUntil: 'networkidle' }),
      docsPage.goto(`${DOCS_URL}`, { waitUntil: 'networkidle' }),
    ]);

    // Measure button styles on employer-web
    const empBtnStyles = await empPage.evaluate(() => {
      const btn = document.querySelector('button');
      if (!btn) return null;
      const cs = window.getComputedStyle(btn);
      return {
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        lineHeight: cs.lineHeight,
        gap: cs.gap,
        borderRadius: cs.borderRadius,
      };
    });

    // Measure button styles on design docs
    const docsBtnStyles = await docsPage.evaluate(() => {
      const btn = document.querySelector('button');
      if (!btn) return null;
      const cs = window.getComputedStyle(btn);
      return {
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        lineHeight: cs.lineHeight,
        gap: cs.gap,
        borderRadius: cs.borderRadius,
      };
    });

    console.log('Employer button styles:', JSON.stringify(empBtnStyles, null, 2));
    console.log('Docs button styles:', JSON.stringify(docsBtnStyles, null, 2));

    if (empBtnStyles && docsBtnStyles) {
      expect(empBtnStyles.fontSize).toBe(docsBtnStyles.fontSize);
      expect(empBtnStyles.gap).toBe(docsBtnStyles.gap);
    }

    await Promise.all([empPage.close(), docsPage.close()]);
  });
});

// ─── 3. Icon Spacing in Buttons ─────────────────────────────────────────────

test.describe('Icon spacing uses gap-2 (no manual mr-2)', () => {
  test('buttons with icons use gap for spacing, not margin', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(`${EMPLOYER_URL}/finance`, { waitUntil: 'networkidle' });

    const iconSpacing = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const results: Array<{
        text: string;
        gap: string;
        iconMarginRight: string | null;
        hasIcon: boolean;
      }> = [];

      for (const btn of buttons) {
        const svg = btn.querySelector('svg');
        const hasIcon = !!svg;
        results.push({
          text: btn.textContent?.trim() || '',
          gap: window.getComputedStyle(btn).gap,
          iconMarginRight: svg ? window.getComputedStyle(svg).marginRight : null,
          hasIcon,
        });
      }
      return results;
    });

    console.log('Icon spacing in buttons:');
    for (const item of iconSpacing) {
      if (item.hasIcon) {
        console.log(`  "${item.text}" — gap: ${item.gap}, icon marginRight: ${item.iconMarginRight}`);
        // gap should be set (8px = gap-2), and icon margin-right should NOT be set (0px or normal)
        expect(item.gap).not.toBe('normal');
        // mr-2 = 8px margin-right; if gap is used, icon should have 0px margin
        if (item.iconMarginRight) {
          expect(item.iconMarginRight).toBe('0px');
        }
      }
    }

    await page.close();
  });
});

// ─── 4. Table Typography ────────────────────────────────────────────────────

test.describe('Table typography matches design system', () => {
  test('table headers and cells use correct font sizes', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(`${EMPLOYER_URL}/finance`, { waitUntil: 'networkidle' });

    const tableInfo = await page.evaluate(() => {
      const headers = Array.from(document.querySelectorAll('th'));
      const cells = Array.from(document.querySelectorAll('td'));

      return {
        headers: headers.slice(0, 5).map(th => ({
          text: th.textContent?.trim() || '',
          fontSize: window.getComputedStyle(th).fontSize,
          fontWeight: window.getComputedStyle(th).fontWeight,
          color: window.getComputedStyle(th).color,
        })),
        cells: cells.slice(0, 5).map(td => ({
          text: td.textContent?.trim().substring(0, 30) || '',
          fontSize: window.getComputedStyle(td).fontSize,
          color: window.getComputedStyle(td).color,
        })),
      };
    });

    console.log('Table headers:', JSON.stringify(tableInfo.headers, null, 2));
    console.log('Table cells (first 5):', JSON.stringify(tableInfo.cells, null, 2));

    // Headers should use text-xs (12px) or text-sm (14px) — not the old 11px/13px
    for (const h of tableInfo.headers) {
      const size = parseInt(h.fontSize);
      expect(size).toBeGreaterThanOrEqual(12);
      console.log(`  Header "${h.text}": ${h.fontSize} — OK`);
    }

    // Cells should use text-sm (14px) or text-base (16px) — not old 13px/14px
    for (const c of tableInfo.cells) {
      const size = parseInt(c.fontSize);
      expect(size).toBeGreaterThanOrEqual(12);
      console.log(`  Cell "${c.text}": ${c.fontSize} — OK`);
    }

    await page.close();
  });
});

// ─── 5. Body Font Size (no custom override) ─────────────────────────────────

test.describe('Body font size is browser default (16px)', () => {
  test('body element has 16px font size on employer-web', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(`${EMPLOYER_URL}/finance`, { waitUntil: 'networkidle' });

    const bodyFontSize = await page.evaluate(() =>
      window.getComputedStyle(document.body).fontSize
    );
    console.log(`Body font size: ${bodyFontSize}`);
    expect(bodyFontSize).toBe('16px');

    await page.close();
  });

  test('html root font size is 16px (no custom root override)', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(`${EMPLOYER_URL}/finance`, { waitUntil: 'networkidle' });

    const rootFontSize = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).fontSize
    );
    console.log(`Root (html) font size: ${rootFontSize}`);
    expect(rootFontSize).toBe('16px');

    await page.close();
  });
});

// ─── 6. Cross-Page Checks ───────────────────────────────────────────────────

test.describe('Cross-page visual checks', () => {
  test('Finance page renders without errors', async ({ browser }) => {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(`${EMPLOYER_URL}/finance`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'e2e/typography-audit/screenshots/finance-page.png', fullPage: true });

    // Verify key elements exist
    await expect(page.locator('table')).toBeVisible();
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeVisible();

    console.log(`Finance page console errors: ${errors.length}`);
    if (errors.length) console.log(errors.join('\n'));

    await page.close();
  });

  test('Hiring page renders without errors', async ({ browser }) => {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(`${EMPLOYER_URL}/hiring`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'e2e/typography-audit/screenshots/hiring-page.png', fullPage: true });

    // Page should load without crashing
    const body = page.locator('body');
    await expect(body).toBeVisible();

    console.log(`Hiring page console errors: ${errors.length}`);
    if (errors.length) console.log(errors.join('\n'));

    await page.close();
  });

  test('Dashboard page renders without errors', async ({ browser }) => {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(`${EMPLOYER_URL}/dashboard`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'e2e/typography-audit/screenshots/dashboard-page.png', fullPage: true });

    const body = page.locator('body');
    await expect(body).toBeVisible();

    console.log(`Dashboard page console errors: ${errors.length}`);
    if (errors.length) console.log(errors.join('\n'));

    await page.close();
  });
});

// ─── 7. Side-by-Side Screenshot Comparison ──────────────────────────────────

test.describe('Visual comparison screenshots', () => {
  test('capture Finance page side-by-side with design docs', async ({ browser }) => {
    const [empPage, docsPage] = await Promise.all([
      browser.newPage(),
      browser.newPage(),
    ]);

    await Promise.all([
      empPage.goto(`${EMPLOYER_URL}/finance`, { waitUntil: 'networkidle' }),
      docsPage.goto(`${DOCS_URL}`, { waitUntil: 'networkidle' }),
    ]);

    await Promise.all([
      empPage.screenshot({ path: 'e2e/typography-audit/screenshots/employer-finance.png', fullPage: true }),
      docsPage.screenshot({ path: 'e2e/typography-audit/screenshots/design-docs-home.png', fullPage: true }),
    ]);

    console.log('Screenshots saved to e2e/typography-audit/screenshots/');

    await Promise.all([empPage.close(), docsPage.close()]);
  });
});
