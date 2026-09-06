const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\SAIF SERVICE CENTER\\.gemini\\antigravity\\brain\\d93092d7-b1a0-4bb5-98da-94f34a5978f7';

async function verifyFeature1() {
  console.log('Launching browser with Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 800 });

  console.log('Navigating to http://127.0.0.1:5173...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

  // Seed sample tasks directly into IndexedDB via page evaluation
  console.log('Seeding tasks into IndexedDB...');
  await page.evaluate(async () => {
    // Open DayFlowPlannerDB
    const req = indexedDB.open('DayFlowPlannerDB');
    await new Promise((resolve, reject) => {
      req.onsuccess = async () => {
        const db = req.result;
        const tx = db.transaction('tasks', 'readwrite');
        const store = tx.objectStore('tasks');
        store.clear();

        const today = new Date();
        const formatDate = (d) => {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${y}-${m}-${day}`;
        };

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const sampleTasks = [
          {
            title: 'Prepare quarterly financial report',
            description: 'Rolled over from yesterday — needs immediate review',
            date: formatDate(yesterday),
            completed: false,
            priority: 'high',
            time: '14:00',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            title: 'Team sprint alignment & standup',
            description: 'Discuss Q3 roadmap deliverables with engineering leads',
            date: formatDate(today),
            completed: false,
            priority: 'med',
            time: '09:30',
            createdAt: new Date().toISOString()
          },
          {
            title: 'Finalize client proposal documentation',
            description: 'Incorporate client feedback from yesterday meeting',
            date: formatDate(today),
            completed: false,
            priority: 'high',
            time: '11:00',
            createdAt: new Date().toISOString()
          },
          {
            title: 'Clear email backlog & prioritize tickets',
            description: 'Reach inbox zero before afternoon focus block',
            date: formatDate(today),
            completed: true,
            completedAt: new Date().toISOString(),
            priority: 'low',
            time: '08:30',
            createdAt: new Date().toISOString()
          },
          {
            title: '30-minute afternoon walk & hydration',
            date: formatDate(today),
            completed: false,
            priority: 'low',
            createdAt: new Date().toISOString()
          }
        ];

        for (const task of sampleTasks) {
          store.add(task);
        }

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      req.onerror = () => reject(req.error);
    });
  });

  // Reload page to display seeded data
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));

  const screenshotPath = path.join(ARTIFACT_DIR, 'feature1_daily_tasks.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Saved screenshot to ${screenshotPath}`);

  await browser.close();
}

verifyFeature1().catch(err => {
  console.error('Error verifying feature 1:', err);
  process.exit(1);
});
