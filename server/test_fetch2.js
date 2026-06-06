const http = require('http');

http.get('http://localhost:5001/api/dashboard/tests', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'RESPONSE:', data.substring(0, 200)));
}).on('error', err => console.log('ERROR:', err.message));
