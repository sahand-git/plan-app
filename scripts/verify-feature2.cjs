const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\SAIF SERVICE CENTER\\.gemini\\antigravity\\brain\\d93092d7-b1a0-4bb5-98da-94f34a5978f7';

async function verifyFeature2() {
  console.log('Launching browser with Edge for Feature 2...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = browser.defaultBrowserContext();
  await context.overridePermissions('http://127.0.0.1:5173', ['notifications']);

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 850 });

  console.log('Navigating to http://127.0.0.1:5173...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

  // Open "Add Task" modal
  console.log('Opening Add Task modal...');
  const addTaskButton = await page.$('button[title*="Add Task"]');
  if (addTaskButton) {
    await addTaskButton.click();
  } else {
    // Try pressing 'n' key
    await page.keyboard.press('n');
  }

  await new Promise(r => setTimeout(r, 600));

  // Enable Reminder checkbox
  console.log('Enabling reminder and filling form...');
  await page.evaluate(() => {
    // Find the reminder checkbox
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (const cb of checkboxes) {
      if (!cb.checked) {
        cb.click();
      }
    }
  });

  await new Promise(r => setTimeout(r, 400));

  // Fill in Task Title
  await page.type('input[placeholder*="Review project"]', 'Product Review & Sync Call');

  // Change repeat to weekly so days of week appear
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    for (const s of selects) {
      s.value = 'weekly';
      s.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 600));

  const screenshotPath = path.join(ARTIFACT_DIR, 'feature2_reminders.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Saved screenshot to ${screenshotPath}`);

  await browser.close();
}

verifyFeature2().catch(err => {
  console.error('Error verifying feature 2:', err);
  process.exit(1);
});
