
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/coaching.db");

db.serialize(() => {
  /* ── Core tables ── */
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      firstName TEXT,
      lastName TEXT,
      middleName TEXT,
      phoneNumber TEXT,
      city TEXT,
      country TEXT,
      role TEXT DEFAULT 'student',
      status TEXT DEFAULT 'Active',
      paymentStatus TEXT DEFAULT 'Pending',
      score_gain INTEGER DEFAULT 0,
      avatar TEXT,
      course_id INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `, () => {
    db.run("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'Active'", (err) => {});
    db.run("ALTER TABLE users ADD COLUMN paymentStatus TEXT DEFAULT 'Pending'", (err) => {});
    db.run("ALTER TABLE users ADD COLUMN score_gain INTEGER DEFAULT 0", (err) => {});
    db.run("ALTER TABLE users ADD COLUMN avatar TEXT", (err) => {});
    db.run("ALTER TABLE users ADD COLUMN course_id INTEGER", (err) => {});
    db.run("ALTER TABLE users ADD COLUMN created_at TEXT DEFAULT (datetime('now'))", (err) => {});

    // Seed/Update admin: admin@pyqs.com / admin123
    const adminEmail = "admin@pyqs.com";
    const adminPass  = "$2a$10$DuT73RQhdG.Q8Gqt2t8FOO5Vp7Zcm7zAcjNRXBEpUfs7u3fJns5Gm"; // admin123
    db.run("INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)", [adminEmail, adminPass, "admin"]);
    db.run("UPDATE users SET email = ?, password = ? WHERE role = 'admin'", [adminEmail, adminPass]);
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#7c3aed'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER,
      course_id  INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      UNIQUE(user_id, course_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER,
      amount     REAL NOT NULL,
      status     TEXT DEFAULT 'Completed',
      method     TEXT DEFAULT 'UPI/Card',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  /* ── Seed courses ── */
  db.get("SELECT COUNT(*) as cnt FROM courses", (err, row) => {
    if (!err && row.cnt === 0) {
      const courses = [
        ["SAT Complete Prep",     "#7c3aed"],
        ["ACT Mastery Program",   "#ec4899"],
        ["AP Sciences Bundle",    "#06b6d4"],
        ["AP Calculus AB/BC",     "#f59e0b"],
        ["SAT Reading & Writing", "#10b981"],
        ["SAT Math Intensive",    "#ef4444"],
      ];
      const stmt = db.prepare("INSERT INTO courses (name, color) VALUES (?, ?)");
      courses.forEach(([name, color]) => stmt.run(name, color));
      stmt.finalize();
    }
  });

  /* ── Seed students ── */
  db.get("SELECT COUNT(*) as cnt FROM users WHERE role = 'student'", (err, row) => {
    if (!err && row.cnt === 0) {
      const students = [
        ["Aarav", "Sharma", "aarav@example.com", 1, "Active", 230, "A"],
        ["Diya", "Patel", "diya@example.com", 2, "Active", 190, "D"],
        ["Rohan", "Gupta", "rohan@example.com", 4, "Inactive", 160, "R"],
        ["Priya", "Singh", "priya@example.com", 6, "Active", 200, "P"],
        ["Kabir", "Mehta", "kabir@example.com", 3, "Active", 250, "K"],
        ["Simran", "Kaur", "simran@example.com", 5, "Pending", 0, "S"],
        ["Ananya", "Reddy", "ananya@example.com", 1, "Active", 175, "A"],
        ["Vikram", "Nair", "vikram@example.com", 2, "Active", 210, "V"],
        ["Tanvi", "Joshi", "tanvi@example.com", 3, "Inactive", 130, "T"],
        ["Arjun", "Verma", "arjun@example.com", 4, "Active", 270, "A"],
      ];
      const stmt = db.prepare(
        "INSERT INTO users (firstName, lastName, email, course_id, status, score_gain, avatar, role) VALUES (?,?,?,?,?,?,?,?)"
      );
      students.forEach(([f, l, email, cid, status, score, avatar]) =>
        stmt.run(f, l, email, cid, status, score, avatar, "student")
      );
      stmt.finalize();
    }
  });
});

module.exports = db;
