const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/coaching.db');

db.get("SELECT id, email, role, password FROM users WHERE role='admin'", async (err, row) => {
  if (err) { console.log('DB Error:', err.message); db.close(); return; }
  if (!row) { console.log('No admin user found!'); db.close(); return; }

  console.log('Admin found:', row.email, '| role:', row.role);

  const match = await bcrypt.compare('admin123', row.password);
  console.log('Password "admin123" matches hash:', match);

  if (!match) {
    // Fix: update password to a fresh hash of admin123
    const newHash = await bcrypt.hash('admin123', 10);
    db.run("UPDATE users SET password = ? WHERE role = 'admin'", [newHash], function(err2) {
      if (err2) console.log('Update error:', err2.message);
      else console.log('✅ Password reset to admin123 successfully!');
      db.close();
    });
  } else {
    console.log('✅ Password is correct — login should work!');
    db.close();
  }
});
