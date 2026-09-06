const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\SAIF SERVICE CENTER\\.gemini\\antigravity\\brain\\d93092d7-b1a0-4bb5-98da-94f34a5978f7';

async function verifyFeature4() {
  console.log('Launching browser with Edge for Feature 4...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 850 });

  console.log('Navigating to http://127.0.0.1:5173...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

  // Click on "Journal" tab in navigation
  console.log('Navigating to Journal view...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav button'));
    const journalBtn = buttons.find(b => b.textContent.includes('Journal'));
    if (journalBtn) journalBtn.click();
  });

  await new Promise(r => setTimeout(r, 600));

  // Type sample markdown content in the textarea
  console.log('Typing journal notes...');
  const sampleNote = `# Daily Focus & Reflections

> "Discipline is choosing between what you want now and what you want most."

### Key Priorities Completed Today
- **Client Architecture Review**: Approved modular component architecture with zero breaking changes.
- **IndexedDB Performance**: Verified *Dexie.js* reactive queries respond in under \`5ms\`.
- **Offline PWA Readiness**: Confirmed service worker caching works offline seamlessly.

### Ideas for Tomorrow
1. Set up daily habit tracker streaks for workout and reading.
2. Prepare quarterly strategy sync deck.`;

  await page.type('textarea', sampleNote, { delay: 10 });

  // Wait for debounced auto-save
  await new Promise(r => setTimeout(r, 1200));

  // Toggle to Preview tab
  console.log('Switching to Preview mode...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const previewBtn = buttons.find(b => b.textContent.trim() === 'Preview');
    if (previewBtn) previewBtn.click();
  });

  await new Promise(r => setTimeout(r, 600));

  const screenshotPath = path.join(ARTIFACT_DIR, 'feature4_journal.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Saved journal screenshot to ${screenshotPath}`);

  await browser.close();
}

verifyFeature4().catch(err => {
  console.error('Error verifying feature 4:', err);
  process.exit(1);
});
