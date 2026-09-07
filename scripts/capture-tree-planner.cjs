const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\SAIF SERVICE CENTER\\.gemini\\antigravity\\brain\\decc2b1b-4b53-430b-b8c3-86bee64eb108';

async function capture() {
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  console.log('Launching browser with Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 950, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:4173...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  // Set onboarded in localStorage so screen starts cleanly on home screen
  await page.evaluate(() => {
    localStorage.setItem('treeplanner_onboarded', 'true');
    localStorage.setItem('treeplanner_tree_state', 'foliage');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Screenshot 1: iOS 18 Home screen mockup
  const iosPath = path.join(ARTIFACT_DIR, 'the_tree_planner_ios_home.png');
  await page.screenshot({ path: iosPath, fullPage: false });
  console.log('Captured:', iosPath);

  // Switch to Android Material 3 frame
  console.log('Switching to Android M3 frame...');
  const androidBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Android M3'));
  });
  if (androidBtn) {
    await androidBtn.click();
    await new Promise(r => setTimeout(r, 800));
  }

  // Switch tree to gentle wilt (Seasonal Rest) to showcase wilt state
  await page.evaluate(() => {
    localStorage.setItem('treeplanner_tree_state', 'gentle_wilt');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  // Re-click Android M3
  const androidBtn2 = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Android M3'));
  });
  if (androidBtn2) {
    await androidBtn2.click();
    await new Promise(r => setTimeout(r, 600));
  }

  const androidPath = path.join(ARTIFACT_DIR, 'the_tree_planner_android_home.png');
  await page.screenshot({ path: androidPath, fullPage: false });
  console.log('Captured:', androidPath);

  // Click on tree to open TreeStatsModal
  const treeEl = await page.$('[role="button"][aria-label*="Botanical Tree"]');
  if (treeEl) {
    await treeEl.click();
    await new Promise(r => setTimeout(r, 600));
    const statsPath = path.join(ARTIFACT_DIR, 'the_tree_planner_tree_stats.png');
    await page.screenshot({ path: statsPath, fullPage: false });
    console.log('Captured:', statsPath);
  }

  // Navigate to Daily Journal Sanctuary tab
  console.log('Navigating to Journal tab...');
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  const journalTab = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Journal'));
  });
  if (journalTab) {
    await journalTab.click();
    await new Promise(r => setTimeout(r, 600));
    const journalPath = path.join(ARTIFACT_DIR, 'the_tree_planner_journal.png');
    await page.screenshot({ path: journalPath, fullPage: false });
    console.log('Captured:', journalPath);
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
