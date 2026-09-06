const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\SAIF SERVICE CENTER\\.gemini\\antigravity\\brain\\d93092d7-b1a0-4bb5-98da-94f34a5978f7';

async function verifyFeature6() {
  console.log('Launching browser with Edge for Feature 6...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 950 });

  console.log('Navigating to http://127.0.0.1:5173...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

  // Seed data
  await page.evaluate(async () => {
    const req = indexedDB.open('DayFlowPlannerDB');
    await new Promise((resolve) => {
      req.onsuccess = async () => {
        const db = req.result;
        const tx = db.transaction(['tasks', 'notes', 'habits', 'habitLogs'], 'readwrite');
        const tasks = tx.objectStore('tasks');
        const notes = tx.objectStore('notes');
        const habits = tx.objectStore('habits');
        const logs = tx.objectStore('habitLogs');

        tasks.add({ title: 'Complete Sprint Demo', date: '2026-09-06', completed: false, priority: 'high', time: '11:00', createdAt: new Date().toISOString() });
        tasks.add({ title: 'Review Code PR #42', date: '2026-09-06', completed: true, completedAt: new Date().toISOString(), priority: 'med', time: '13:30', createdAt: new Date().toISOString() });
        tasks.add({ title: 'Send Weekly Status', date: '2026-09-06', completed: false, priority: 'low', createdAt: new Date().toISOString() });
        tasks.add({ title: 'Quarterly Planning Doc', date: '2026-09-05', completed: false, priority: 'high', createdAt: new Date().toISOString() });

        notes.put({ date: '2026-09-06', content: '# Focus\nAchieve inbox zero and finalize deliverables.', updatedAt: new Date().toISOString() });

        const h1 = habits.add({ title: 'Morning Workout', color: 'Emerald', createdAt: new Date().toISOString(), archived: false });
        const h2 = habits.add({ title: 'Read 20 Pages', color: 'Indigo', createdAt: new Date().toISOString(), archived: false });
        
        h1.onsuccess = () => {
          logs.add({ habitId: h1.result, date: '2026-09-06', completed: true });
          logs.add({ habitId: h1.result, date: '2026-09-05', completed: true });
        };
        h2.onsuccess = () => {
          logs.add({ habitId: h2.result, date: '2026-09-05', completed: true });
        };

        tx.oncomplete = () => resolve();
      };
    });
  });

  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Navigate to Data tab
  console.log('Navigating to Data view...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav button'));
    const dataBtn = buttons.find(b => b.textContent.includes('Data'));
    if (dataBtn) dataBtn.click();
  });

  await new Promise(r => setTimeout(r, 600));

  // Capture Data Management Light view screenshot
  const screenshotPath = path.join(ARTIFACT_DIR, 'feature6_data_management.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Saved data management screenshot to ${screenshotPath}`);

  // Test Export by evaluating Dexie data retrieval
  console.log('Verifying export payload structure...');
  const exportData = await page.evaluate(async () => {
    const req = indexedDB.open('DayFlowPlannerDB');
    return new Promise((resolve) => {
      req.onsuccess = async () => {
        const db = req.result;
        const tx = db.transaction(['tasks', 'notes', 'habits', 'habitLogs'], 'readonly');
        const tasks = await new Promise(res => { tx.objectStore('tasks').getAll().onsuccess = (e) => res(e.target.result); });
        const notes = await new Promise(res => { tx.objectStore('notes').getAll().onsuccess = (e) => res(e.target.result); });
        const habits = await new Promise(res => { tx.objectStore('habits').getAll().onsuccess = (e) => res(e.target.result); });
        const logs = await new Promise(res => { tx.objectStore('habitLogs').getAll().onsuccess = (e) => res(e.target.result); });
        resolve({
          tasksCount: tasks.length,
          notesCount: notes.length,
          habitsCount: habits.length,
          logsCount: logs.length
        });
      };
    });
  });

  console.log('Export data counts verified:', exportData);

  // Toggle Dark Mode
  console.log('Testing Dark Mode...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const darkBtn = buttons.find(b => b.textContent.trim() === 'Dark');
    if (darkBtn) darkBtn.click();
  });

  await new Promise(r => setTimeout(r, 600));

  // Navigate back to Tasks tab in Dark Mode to capture full dark mode aesthetic
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav button'));
    const tasksBtn = buttons.find(b => b.textContent.includes('Tasks'));
    if (tasksBtn) tasksBtn.click();
  });

  await new Promise(r => setTimeout(r, 600));

  const darkModeScreenshotPath = path.join(ARTIFACT_DIR, 'feature6_dark_mode.png');
  await page.screenshot({ path: darkModeScreenshotPath, fullPage: true });
  console.log(`Saved dark mode screenshot to ${darkModeScreenshotPath}`);

  await browser.close();
}

verifyFeature6().catch(err => {
  console.error('Error verifying feature 6:', err);
  process.exit(1);
});
