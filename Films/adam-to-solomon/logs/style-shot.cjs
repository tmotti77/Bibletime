const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  for (const s of ['a', 'b', 'c']) { await p.goto('file://' + path.resolve('logs/style-test.html') + '?style=' + s); await p.waitForFunction('window.DONE === true', null, { timeout: 30000 }).catch(() => console.log('timeout', s)); await p.screenshot({ path: `review/style-${s}.png` }); }
  await b.close(); })();
