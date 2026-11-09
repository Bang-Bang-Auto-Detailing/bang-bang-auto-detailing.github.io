import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { extname, resolve, sep } from 'node:path';

// Reuse the browser dependency already installed for BackstopJS.
const require = createRequire(import.meta.url);
const requireBackstop = createRequire(require.resolve('backstopjs/package.json'));
const puppeteer = requireBackstop('puppeteer');
const siteDirectory = resolve('_site');
const origin = 'http://contact.test';
const endpoint = 'https://api.web3forms.com/submit';
const contentTypes = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2',
};
let browser;

before(async () => {
  browser = await puppeteer.launch({
    headless: true,
    ...(process.env.PUPPETEER_EXECUTABLE_PATH && {
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    }),
  });
});
after(async () => browser?.close());

async function openPage(t, width, { path = '/contact-us/', javascript = true } = {}) {
  const page = await browser.newPage();
  t.after(() => page.close());
  await page.setViewport({ width, height: 900 });
  await page.setJavaScriptEnabled(javascript);
  const submissions = [];
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  // Every request is intercepted. Tests never contact Web3Forms, analytics,
  // production, or another external service, even for valid submissions.
  await page.setRequestInterception(true);
  page.on('request', async (request) => {
    if (request.url() === endpoint && request.method() === 'POST') {
      submissions.push(Object.fromEntries(new URLSearchParams(request.postData())));
      await request.respond({ status: 200, contentType: 'text/html', body: '<p>Test submission captured locally.</p>' });
      return;
    }
    const url = new URL(request.url());
    if (url.origin !== origin || request.method() !== 'GET') {
      await request.abort();
      return;
    }
    const path = decodeURIComponent(url.pathname);
    const file = resolve(siteDirectory, `.${path}${path.endsWith('/') ? 'index.html' : ''}`);
    if (!file.startsWith(`${siteDirectory}${sep}`)) {
      await request.abort();
      return;
    }
    try {
      await request.respond({ status: 200, contentType: contentTypes[extname(file)] || 'application/octet-stream', body: await readFile(file) });
    } catch {
      await request.respond({ status: 404, body: 'Not found' });
    }
  });
  await page.goto(`${origin}${path}`, { waitUntil: 'load' });
  t.after(() => assert.deepEqual(errors, [], 'No application JavaScript errors'));
  return { page, submissions };
}

async function fill(page, values) {
  await page.evaluate((values) => {
    for (const [id, value] of Object.entries(values)) {
      const field = document.getElementById(`contact-${id}`);
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, values);
}

async function expectBlocked(page, submissions) {
  await page.click('button[type="submit"]');
  assert.equal(await page.$eval('.contact-form', (form) => form.checkValidity()), false);
  assert.equal(page.url(), `${origin}/contact-us/`);
  assert.equal(submissions.length, 0);
}

async function expectSubmitted(page, submissions, values) {
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.click('button[type="submit"]'),
  ]);
  assert.equal(submissions.length, 1);
  assert.equal(submissions[0].Name, 'Test Customer');
  assert.ok(submissions[0].access_key, 'Existing Web3Forms key is retained');
  for (const [name, value] of Object.entries(values)) assert.equal(submissions[0][name], value);
}

for (const width of [375, 1440]) {
  test(`Contact customer paths at ${width}px`, async (t) => {
    await t.test('Homepage About CTA navigates to Contact Us, including Back and repeat navigation', async (t) => {
      const { page } = await openPage(t, width, { path: '/' });
      const selector = 'main a.btn[href="/contact-us/"]';
      assert.equal(await page.$eval(selector, (link) => link.textContent.trim()), 'Contact us');
      assert.equal(await page.$('a[href="/#contact"]'), null);
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const [response] = await Promise.all([page.waitForNavigation(), page.click(selector)]);
        assert.equal(response.status(), 200);
        assert.equal(page.url(), `${origin}/contact-us/`);
        assert.equal(await page.$eval('h1', (heading) => heading.textContent), 'Contact Us');
        if (attempt === 0) await page.goBack({ waitUntil: 'load' });
      }
    });

    await t.test('Name alone and repeated invalid clicks are blocked with a useful message', async (t) => {
      const { page, submissions } = await openPage(t, width);
      await fill(page, { name: 'Test Customer' });
      await expectBlocked(page, submissions);
      await expectBlocked(page, submissions);
      assert.match(await page.$eval('#contact-phone', (field) => field.validationMessage), /phone number or email address/);
      assert.equal(await page.$eval('#contact-phone', (field) => field === document.activeElement), true);
    });

    await t.test('Whitespace-only contact details are blocked', async (t) => {
      const { page, submissions } = await openPage(t, width);
      await fill(page, { name: 'Test Customer', phone: '   ', email: '   ' });
      await expectBlocked(page, submissions);
    });

    for (const [label, fields, payload] of [
      ['Email only', { email: 'customer@example.com' }, { Email: 'customer@example.com', Phone: '', Message: '' }],
      ['Phone only', { phone: '(407) 555-0100' }, { Phone: '(407) 555-0100', Email: '', Message: '' }],
      ['Both contact methods', { phone: '(407) 555-0100', email: 'customer@example.com', message: 'A detailing question.' }, { Phone: '(407) 555-0100', Email: 'customer@example.com', Message: 'A detailing question.' }],
    ]) {
      await t.test(`${label} preserves the native Web3Forms POST and optional message`, async (t) => {
        const { page, submissions } = await openPage(t, width);
        await fill(page, { name: 'Test Customer', ...fields });
        assert.equal(await page.$eval('.contact-form', (form) => form.action), endpoint);
        assert.equal(await page.$eval('.contact-form', (form) => form.method), 'post');
        await expectSubmitted(page, submissions, payload);
      });
    }

    await t.test('Name remains required and malformed email remains invalid even with a phone', async (t) => {
      const { page, submissions } = await openPage(t, width);
      await fill(page, { email: 'customer@example.com' });
      await expectBlocked(page, submissions);
      await fill(page, { name: 'Test Customer', phone: '(407) 555-0100', email: 'not-an-email' });
      await expectBlocked(page, submissions);
      assert.equal(await page.$eval('#contact-email', (field) => field.validity.typeMismatch), true);
    });

    await t.test('Validation recovers when switching methods, clearing, and resetting', async (t) => {
      const { page, submissions } = await openPage(t, width);
      await fill(page, { name: 'Test Customer' });
      await expectBlocked(page, submissions);
      await fill(page, { email: 'customer@example.com' });
      assert.equal(await page.$eval('.contact-form', (form) => form.checkValidity()), true);
      await fill(page, { email: '', phone: '(407) 555-0100' });
      assert.equal(await page.$eval('.contact-form', (form) => form.checkValidity()), true);
      await fill(page, { phone: '' });
      await expectBlocked(page, submissions);
      await fill(page, { phone: '(407) 555-0100' });
      await page.$eval('.contact-form', (form) => form.reset());
      await fill(page, { name: 'Test Customer' });
      await expectBlocked(page, submissions);
      await fill(page, { phone: '(407) 555-0100' });
      await expectSubmitted(page, submissions, { Phone: '(407) 555-0100', Email: '' });
    });

    await t.test('Restored and autofilled contact values refresh validation', async (t) => {
      const { page, submissions } = await openPage(t, width);
      await fill(page, { name: 'Test Customer' });
      await page.$eval('#contact-email', (field) => { field.value = 'customer@example.com'; });
      await page.evaluate(() => window.dispatchEvent(new Event('pageshow')));
      assert.equal(await page.$eval('.contact-form', (form) => form.checkValidity()), true);
      await page.$eval('#contact-email', (field) => { field.value = ''; });
      await expectBlocked(page, submissions);
      // Simulate autofill that changes the value without emitting input/change.
      await page.$eval('#contact-phone', (field) => { field.value = '(407) 555-0100'; });
      await expectSubmitted(page, submissions, { Phone: '(407) 555-0100', Email: '' });
    });

    await t.test('Enter-key submission respects the contact requirement', async (t) => {
      const { page, submissions } = await openPage(t, width);
      await fill(page, { name: 'Test Customer' });
      await page.focus('#contact-name');
      await page.keyboard.press('Enter');
      assert.equal(submissions.length, 0);
      assert.equal(await page.$eval('.contact-form', (form) => form.checkValidity()), false);
      await fill(page, { email: 'customer@example.com' });
      await page.focus('#contact-email');
      await Promise.all([page.waitForNavigation(), page.keyboard.press('Enter')]);
      assert.equal(submissions.length, 1);
    });

    await t.test('Help is associated with both contact fields and the form fits the viewport', async (t) => {
      const { page } = await openPage(t, width);
      for (const selector of ['#contact-phone', '#contact-email']) {
        assert.equal(await page.$eval(selector, (field) => field.getAttribute('aria-describedby')), 'contact-method-help');
      }
      assert.match(await page.$eval('#contact-method-help', (help) => help.textContent), /email address or phone number/);
      assert.equal(await page.$eval('.contact-form', (form) => {
        const box = form.getBoundingClientRect();
        return box.left >= 0 && box.right <= window.innerWidth;
      }), true);
    });

    await t.test('Without JavaScript, an email is required and the fallback explains how to call', async (t) => {
      const { page, submissions } = await openPage(t, width, { javascript: false });
      await fill(page, { name: 'Test Customer', phone: '(407) 555-0100' });
      await expectBlocked(page, submissions);
      assert.equal(await page.$eval('#contact-email', (field) => field.required), true);
      assert.match(await page.$eval('noscript', (element) => element.textContent), /Email is required when JavaScript is unavailable/);
      await fill(page, { email: 'customer@example.com' });
      await expectSubmitted(page, submissions, { Email: 'customer@example.com' });
    });
  });
}
