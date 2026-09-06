const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\SAIF SERVICE CENTER\\.gemini\\antigravity\\brain\\d93092d7-b1a0-4bb5-98da-94f34a5978f7';

async function verifyFeature3() {
  console.log('Launching browser with Edge for Feature 3...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 850 });

  console.log('Navigating to http://127.0.0.1:5173...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

  // Seed tasks across multiple days of this month
  console.log('Seeding tasks across month...');
  await page.evaluate(async () => {
    const req = indexedDB.open('DayFlowPlannerDB');
    await new Promise((resolve, reject) => {
      req.onsuccess = async () => {
        const db = req.result;
        const tx = db.transaction('tasks', 'readwrite');
        const store = tx.objectStore('tasks');

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const formatDate = (d) => {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${y}-${m}-${day}`;
        };

        const extraTasks = [
          {
            title: 'Design review with client stakeholders',
            date: formatDate(new Date(year, month, 10)),
            completed: false,
            priority: 'high',
            time: '10:00',
            createdAt: new Date().toISOString()
          },
          {
            title: 'Database migration dry run',
            date: formatDate(new Date(year, month, 10)),
            completed: true,
            completedAt: new Date().toISOString(),
            priority: 'med',
            createdAt: new Date().toISOString()
          },
          {
            title: 'Product retrospective & release notes',
            date: formatDate(new Date(year, month, 15)),
            completed: false,
            priority: 'med',
            time: '15:30',
            createdAt: new Date().toISOString()
          },
          {
            title: 'Weekly system backup verification',
            date: formatDate(new Date(year, month, 22)),
            completed: false,
            priority: 'low',
            time: '08:00',
            createdAt: new Date().toISOString()
          }
        ];

        for (const t of extraTasks) {
          store.add(t);
        }

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      req.onerror = () => reject(req.error);
    });
  });

  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Click on "Calendar" tab in navigation
  console.log('Navigating to Calendar view...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav button'));
    const calBtn = buttons.find(b => b.textContent.includes('Calendar'));
    if (calBtn) calBtn.click();
  });

  await new Promise(r => setTimeout(r, 600));

  // Capture Month view
  const monthScreenshotPath = path.join(ARTIFACT_DIR, 'feature3_calendar_month.png');
  await page.screenshot({ path: monthScreenshotPath, fullPage: true });
  console.log(`Saved month screenshot to ${monthScreenshotPath}`);

  // Switch to Week view
  console.log('Switching to Week view...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const weekBtn = buttons.find(b => b.textContent.trim() === 'Week');
    if (weekBtn) weekBtn.click();
  });

  await new Promise(r => setTimeout(r, 600));

  // Capture Week view
  const weekScreenshotPath = path.join(ARTIFACT_DIR, 'feature3_calendar_week.png');
  await page.screenshot({ path: weekScreenshotPath, fullPage: true });
  console.log(`Saved week screenshot to ${weekScreenshotPath}`);

  await browser.close();
}

verifyFeature3().catch(err => {
  console.error('Error verifying feature 3:', err);
  process.exit(1);
});
