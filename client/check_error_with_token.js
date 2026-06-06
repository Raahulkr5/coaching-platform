const puppeteer = require('puppeteer');
const jwt = require('../server/node_modules/jsonwebtoken');

const token = jwt.sign({ id: 1, email: "aarav@example.com", role: "student" }, "mysecretkey");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:5173');
  await page.evaluate((t) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify({
      id: 1, email: "aarav@example.com", role: "student", firstName: "Aarav", lastName: "Sharma", avatar: "A"
    }));
  }, token);
  
  await page.goto('http://localhost:5173/dashboard');
  
  await new Promise(r => setTimeout(r, 2000));
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log("PAGE TEXT:", bodyText);
  
  await browser.close();
})();
