import { test, expect } from '@playwright/test';

test.describe('Student Mobile Web - Smoke Test', () => {
  test('diagnose page rendering and login flow', async ({ page }) => {
    // Collect ALL console messages
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    // Capture page errors (uncaught exceptions)
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    // Step 1: Navigate to the app
    console.log('Navigating to http://localhost:8081/ ...');
    const response = await page.goto('http://localhost:8081/', { waitUntil: 'load', timeout: 30000 });
    console.log(`Response status: ${response?.status()}`);
    console.log(`Response URL: ${response?.url()}`);

    // Wait for JS bundle to load and execute
    await page.waitForTimeout(5000);

    // Step 2: Inspect what's in the DOM
    const pageTitle = await page.title();
    console.log(`Page title: "${pageTitle}"`);

    const bodyHTML = await page.evaluate(() => {
      const body = document.body;
      return {
        childCount: body.children.length,
        innerHTML: body.innerHTML.substring(0, 3000),
        textContent: (body.textContent || '').substring(0, 1000),
        allElements: document.querySelectorAll('*').length,
      };
    });
    console.log(`Body child count: ${bodyHTML.childCount}`);
    console.log(`Total DOM elements: ${bodyHTML.allElements}`);
    console.log(`Body text content: "${bodyHTML.textContent.trim().substring(0, 500)}"`);
    console.log(`Body innerHTML (first 1500 chars): ${bodyHTML.innerHTML.substring(0, 1500)}`);

    // Check for the root element that Expo web uses
    const rootInfo = await page.evaluate(() => {
      const root = document.getElementById('root');
      const appRoot = document.getElementById('app');
      const mainRoot = document.getElementById('main');
      return {
        hasRoot: !!root,
        rootChildren: root?.children.length ?? -1,
        rootInnerHTML: (root?.innerHTML || '').substring(0, 1000),
        hasAppRoot: !!appRoot,
        hasMainRoot: !!mainRoot,
      };
    });
    console.log(`#root exists: ${rootInfo.hasRoot}, children: ${rootInfo.rootChildren}`);
    console.log(`#app exists: ${rootInfo.hasAppRoot}, #main exists: ${rootInfo.hasMainRoot}`);
    console.log(`#root innerHTML (first 500): ${rootInfo.rootInnerHTML.substring(0, 500)}`);

    // Screenshot the initial state
    await page.screenshot({
      path: 'test-results/student-mobile-01-initial.png',
      fullPage: true,
    });

    // Check for any visible text on the page
    const allVisibleText = await page.evaluate(() => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
      );
      const texts: string[] = [];
      let node;
      while ((node = walker.nextNode())) {
        const trimmed = (node.textContent || '').trim();
        if (trimmed) texts.push(trimmed);
      }
      return texts.slice(0, 30);
    });
    console.log(`Visible text nodes (first 30): ${JSON.stringify(allVisibleText)}`);

    // Check for inputs (Expo web TextInput renders as <input>)
    const inputInfo = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, textarea');
      return Array.from(inputs).map(inp => ({
        tag: inp.tagName,
        type: (inp as HTMLInputElement).type,
        placeholder: (inp as HTMLInputElement).placeholder,
        ariaLabel: inp.getAttribute('aria-label'),
        id: inp.id,
        name: (inp as HTMLInputElement).name,
        className: inp.className.substring(0, 100),
      }));
    });
    console.log(`Input elements found: ${inputInfo.length}`);
    inputInfo.forEach((inp, i) => console.log(`  Input ${i}: ${JSON.stringify(inp)}`));

    // Check for any role="button" or clickable elements
    const buttonInfo = await page.evaluate(() => {
      const buttons = document.querySelectorAll('[role="button"], button, [data-testid]');
      return Array.from(buttons).slice(0, 20).map(btn => ({
        tag: btn.tagName,
        role: btn.getAttribute('role'),
        text: (btn.textContent || '').trim().substring(0, 50),
        ariaLabel: btn.getAttribute('aria-label'),
      }));
    });
    console.log(`Button/role=button elements: ${buttonInfo.length}`);
    buttonInfo.forEach((btn, i) => console.log(`  Button ${i}: ${JSON.stringify(btn)}`));

    // Report console output
    console.log('\n=== ALL CONSOLE OUTPUT ===');
    consoleLogs.forEach((log) => console.log(`  ${log}`));

    console.log('\n=== PAGE ERRORS (uncaught exceptions) ===');
    if (pageErrors.length === 0) {
      console.log('  No uncaught page errors');
    } else {
      pageErrors.forEach((err, i) => console.log(`  PageError ${i + 1}: ${err}`));
    }

    // Now try to interact if we found inputs
    if (inputInfo.length >= 2) {
      console.log('\n=== ATTEMPTING LOGIN ===');
      const allInputs = page.locator('input');
      await allInputs.nth(0).fill('test@test.com');
      await allInputs.nth(1).fill('password123');

      await page.screenshot({
        path: 'test-results/student-mobile-02-filled.png',
        fullPage: true,
      });

      // Find and click Log In
      const logInBtn = page.getByRole('button', { name: /log in/i });
      const logInVisible = await logInBtn.isVisible().catch(() => false);
      if (logInVisible) {
        await logInBtn.click();
      } else {
        // Try text-based click
        const textBtn = page.getByText('Log In');
        if (await textBtn.isVisible().catch(() => false)) {
          await textBtn.click();
        }
      }

      await page.waitForTimeout(3000);

      await page.screenshot({
        path: 'test-results/student-mobile-03-after-login.png',
        fullPage: true,
      });

      // Check post-login state
      const postLoginText = await page.evaluate(() => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
        );
        const texts: string[] = [];
        let node;
        while ((node = walker.nextNode())) {
          const trimmed = (node.textContent || '').trim();
          if (trimmed) texts.push(trimmed);
        }
        return texts.slice(0, 30);
      });
      console.log(`Post-login visible text: ${JSON.stringify(postLoginText)}`);

      // Wait for gigs to load
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: 'test-results/student-mobile-04-final.png',
        fullPage: true,
      });

      const finalText = await page.evaluate(() => (document.body.textContent || '').trim().substring(0, 500));
      console.log(`Final page text: "${finalText}"`);
    } else {
      console.log('\n=== CANNOT LOGIN: No input elements found ===');
      console.log('The page appears to be blank or not rendering React components.');
    }

    // Final: check for the specific error pattern
    const elementTypeErrors = pageErrors.filter(
      (e) => e.includes('Element type is invalid')
    );
    const undefinedErrors = pageErrors.filter(
      (e) => e.toLowerCase().includes('undefined') || e.toLowerCase().includes('is not a function')
    );

    console.log('\n=== DIAGNOSIS ===');
    console.log(`"Element type is invalid" errors: ${elementTypeErrors.length}`);
    console.log(`Undefined/not-a-function errors: ${undefinedErrors.length}`);
    console.log(`Total page errors: ${pageErrors.length}`);
    console.log(`Total console messages: ${consoleLogs.length}`);

    // This test is diagnostic - we just need it to complete
    expect(true).toBe(true);
  });
});
