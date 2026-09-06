const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\SAIF SERVICE CENTER\\.gemini\\antigravity\\brain\\d93092d7-b1a0-4bb5-98da-94f34a5978f7';

async function verifyFeature5() {
  console.log('Launching browser with Edge for Feature 5...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 850 });

  console.log('Navigating to http://127.0.0.1:5173...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

  // Seed habits and historical completion logs
  console.log('Seeding habits and logs into IndexedDB...');
  await page.evaluate(async () => {
    const req = indexedDB.open('DayFlowPlannerDB');
    await new Promise((resolve, reject) => {
      req.onsuccess = async () => {
        const db = req.result;
        const tx = db.transaction(['habits', 'habitLogs'], 'readwrite');
        const habitsStore = tx.objectStore('habits');
        const logsStore = tx.objectStore('habitLogs');

        habitsStore.clear();
        logsStore.clear();

        const formatDate = (d) => {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${y}-${m}-${day}`;
        };

        const today = new Date();
        const d0 = formatDate(today);
        const d1 = formatDate(new Date(today.getTime() - 1 * 86400000));
        const d2 = formatDate(new Date(today.getTime() - 2 * 86400000));
        const d3 = formatDate(new Date(today.getTime() - 3 * 86400000));
        const d4 = formatDate(new Date(today.getTime() - 4 * 86400000));

        // Add Habit 1: Morning Workout
        const h1Req = habitsStore.add({
          title: 'Morning Workout & Stretch',
          color: 'Emerald',
          createdAt: new Date().toISOString(),
          archived: false
        });

        // Add Habit 2: Read 20 Pages
        const h2Req = habitsStore.add({
          title: 'Read 20 Pages of Book',
          color: 'Indigo',
          createdAt: new Date().toISOString(),
          archived: false
        });

        // Add Habit 3: Daily Mindfulness
        const h3Req = habitsStore.add({
          title: 'Evening Mindfulness Meditation',
          color: 'Purple',
          createdAt: new Date().toISOString(),
          archived: false
        });

        h1Req.onsuccess = () => {
          const h1Id = h1Req.result;
          // 5 day streak
          logsStore.add({ habitId: h1Id, date: d0, completed: true });
          logsStore.add({ habitId: h1Id, date: d1, completed: true });
          logsStore.add({ habitId: h1Id, date: d2, completed: true });
          logsStore.add({ habitId: h1Id, date: d3, completed: true });
          logsStore.add({ habitId: h1Id, date: d4, completed: true });
        };

        h2Req.onsuccess = () => {
          const h2Id = h2Req.result;
          // Completed yesterday and day before
          logsStore.add({ habitId: h2Id, date: d1, completed: true });
          logsStore.add({ habitId: h2Id, date: d2, completed: true });
        };

        h3Req.onsuccess = () => {
          const h3Id = h3Req.result;
          logsStore.add({ habitId: h3Id, date: d0, completed: true });
        };

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      req.onerror = () => reject(req.error);
    });
  });

  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Click on "Habits" tab in navigation
  console.log('Navigating to Habits view...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav button'));
    const habitsBtn = buttons.find(b => b.textContent.includes('Habits'));
    if (habitsBtn) habitsBtn.click();
  });

  await new Promise(r => setTimeout(r, 800));

  const screenshotPath = path.join(ARTIFACT_DIR, 'feature5_habits.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Saved habits screenshot to ${screenshotPath}`);

  await browser.close();
}

verifyFeature5().catch(err => {
  console.error('Error verifying feature 5:', err);
  process.exit(1);
});
