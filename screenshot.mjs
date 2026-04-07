import { chromium } from 'playwright';

const widths = [1500, 1200, 1120, 1024, 900, 768, 480, 320];
const browser = await chromium.launch();

for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto('http://localhost:3456/', { waitUntil: 'networkidle' });

  // Wait for content to render
  await page.waitForTimeout(500);

  // Screenshot the hero area (top 900px)
  await page.screenshot({ path: `/tmp/hero-${w}px.png`, fullPage: false });

  // Get the H1 bounding box
  const h1 = await page.$('h1');
  if (h1) {
    const box = await h1.boundingBox();
    console.log(`${w}px: H1 box =`, box ? `x:${box.x.toFixed(0)} y:${box.y.toFixed(0)} w:${box.width.toFixed(0)} h:${box.height.toFixed(0)}` : 'NOT FOUND');

    // Check if H1 is visible in viewport
    const visible = await h1.isVisible();
    console.log(`${w}px: H1 visible = ${visible}`);
  } else {
    console.log(`${w}px: H1 element not found`);
  }

  // Also check computed font-size
  const fontSize = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? getComputedStyle(h1).fontSize : 'N/A';
  });
  console.log(`${w}px: H1 font-size = ${fontSize}`);

  // Check if text column has overflow issues
  const textCol = await page.evaluate(() => {
    const el = document.getElementById('63bd85219866cc3622781521');
    if (!el) return 'element not found';
    const style = getComputedStyle(el);
    return {
      height: el.offsetHeight,
      scrollHeight: el.scrollHeight,
      overflow: style.overflow,
      justifyContent: style.justifyContent,
      paddingTop: style.paddingTop,
      paddingLeft: style.paddingLeft,
      width: el.offsetWidth
    };
  });
  console.log(`${w}px: text column =`, JSON.stringify(textCol));
  console.log('---');

  await page.close();
}

await browser.close();
