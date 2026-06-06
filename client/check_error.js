const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set localStorage token and user to bypass login
  await page.goto('http://localhost:5173');
  await page.evaluate(() => {
    localStorage.setItem('token', 'fake_token_for_test');
    localStorage.setItem('user', JSON.stringify({
      id: 1, email: "student@test.com", role: "student", firstName: "Student", lastName: "Test", avatar: "http://example.com/a.jpg"
    }));
  });
  
  await page.goto('http://localhost:5173/dashboard');
  
  // Wait for React to render (either loading, dashboard or error boundary)
  await new Promise(r => setTimeout(r, 2000));
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log("PAGE TEXT:", bodyText);
  
  await browser.close();
})();
