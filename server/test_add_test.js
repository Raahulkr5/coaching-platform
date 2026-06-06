const http = require('http');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, role: 'admin' }, 'mysecretkey');

const data = JSON.stringify({
  title: 'Test',
  html_content: '<p>test</p>'
});

const req = http.request('http://localhost:5001/api/dashboard/tests', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', console.error);
req.write(data);
req.end();
