const db = require("../database/db");
const multer = require("multer");
const path = require("path");

// Multer Storage
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `user-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage }).single("photo");

exports.uploadProfilePhoto = (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(500).json({ message: "Upload failed" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const photoUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    db.run(
      "UPDATE users SET avatar = ? WHERE id = ?",
      [photoUrl, req.user.id],
      function(err) {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ photoUrl });
      }
    );
  });
};

/* ── GET /api/dashboard/stats ── */
exports.getStats = (req, res) => {
  const stats = {};

  db.get("SELECT COUNT(*) as total FROM users WHERE role='student'", (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    stats.totalStudents = row.total;

    db.get("SELECT COUNT(*) as total FROM courses", (err2, row2) => {
      if (err2) return res.status(500).json({ message: err2.message });
      stats.activeCourses = row2.total;

      db.get("SELECT AVG(score_gain) as avg FROM users WHERE role='student' AND score_gain > 0", (err3, row3) => {
        if (err3) return res.status(500).json({ message: err3.message });
        stats.avgScoreGain = Math.round(row3.avg || 0);

        // Revenue is derived: ₹4,600 avg fee × students with Completed payment
        db.get("SELECT COUNT(*) as active FROM users WHERE role='student' AND paymentStatus='Completed'", (err4, row4) => {
          if (err4) return res.status(500).json({ message: err4.message });
          stats.monthlyRevenue = row4.active * 4600;
          res.json(stats);
        });
      });
    });
  });
};

/* ── GET /api/dashboard/students ── */
exports.getStudents = (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : "%";
  db.all(
    `SELECT u.id, u.firstName, u.lastName, (u.firstName || ' ' || u.lastName) AS name, u.email, u.status, u.score_gain, u.avatar, u.paymentStatus, u.phoneNumber,
            c.name AS course, c.color
     FROM users u
     LEFT JOIN courses c ON c.id = u.course_id
     WHERE u.role = 'student' AND (u.firstName LIKE ? OR u.lastName LIKE ? OR c.name LIKE ?)
     ORDER BY u.id DESC`,
    [search, search, search],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    }
  );
};

/* ── GET /api/dashboard/courses ── */
exports.getCourses = (req, res) => {
  db.all(
    `SELECT c.id, c.name, c.color,
            COUNT(s.id) AS enrollments
     FROM courses c
     LEFT JOIN users s ON s.course_id = c.id AND s.role = 'student'
     GROUP BY c.id
     ORDER BY enrollments DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    }
  );
};

/* ── GET /api/dashboard/revenue ── */
exports.getRevenue = (req, res) => {
  db.all(
    `SELECT strftime('%m', created_at) AS month,
            SUM(amount) AS total
     FROM payments
     WHERE created_at >= date('now', '-6 months')
     GROUP BY month
     ORDER BY month`,
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });

      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const data = rows.map(r => ({
        month: monthNames[parseInt(r.month, 10) - 1],
        value: r.total,
      }));

      // Pad with fallback if no real rows yet for demo purposes
      if (data.length === 0) {
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          data.push({ month: monthNames[d.getMonth()], value: Math.floor(Math.random() * 20000 + 15000) });
        }
      }

      res.json(data);
    }
  );
};

/* ── POST /api/dashboard/students ── */
exports.addStudent = (req, res) => {
  const { name, email, course_id, status } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  // Split name for unified schema
  const parts = name.split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ") || "";
  const avatar = firstName.charAt(0).toUpperCase();

  db.run(
    "INSERT INTO users (firstName, lastName, email, course_id, status, avatar, role) VALUES (?,?,?,?,?,?,?)",
    [firstName, lastName, email || "", course_id || null, status || "Active", avatar, "student"],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ id: this.lastID, message: "Student added" });
    }
  );
};

/* ── GET /api/dashboard/my-courses ── */
exports.getMyCourses = (req, res) => {
  const userId = req.user.id;
  db.all(
    `SELECT c.* FROM courses c
     JOIN enrollments e ON e.course_id = c.id
     WHERE e.user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    }
  );
};

/* ── POST /api/dashboard/enroll ── */
exports.enrollCourse = (req, res) => {
  const userId = req.user.id;
  const { course_id } = req.body;
  
  db.run(
    "INSERT OR IGNORE INTO enrollments (user_id, course_id) VALUES (?, ?)",
    [userId, course_id],
    function(err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Enrolled successfully" });
    }
  );
};

/* ── POST /api/dashboard/unenroll ── */
exports.unenrollCourse = (req, res) => {
  const userId = req.user.id;
  const { course_id } = req.body;

  db.run(
    "DELETE FROM enrollments WHERE user_id = ? AND course_id = ?",
    [userId, course_id],
    function(err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Unenrolled successfully" });
    }
  );
};



/* ── POST /api/dashboard/update-profile ── */
exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, phoneNumber } = req.body;

  db.run(
    "UPDATE users SET firstName = ?, lastName = ?, phoneNumber = ? WHERE id = ?",
    [firstName, lastName, phoneNumber, userId],
    function(err) {
      if (err) {
        console.error("Update Profile Error:", err);
        return res.status(500).json({ message: err.message });
      }
      res.json({ message: "Profile updated successfully" });
    }
  );
};

/* ── POST /api/dashboard/pay ── */
exports.processPayment = (req, res) => {
  const userId = req.user.id; 
  const { amount } = req.body;

  db.run(
    "UPDATE users SET paymentStatus = 'Completed' WHERE id = ?",
    [userId],
    function(err) {
      if (err) return res.status(500).json({ message: err.message });
      
      // Also record in payments table
      db.run(
        "INSERT INTO payments (user_id, amount) VALUES (?, ?)",
        [userId, amount || 4600],
        function(err2) {
          if (err2) return res.status(500).json({ message: err2.message });
          res.json({ message: "Payment successful" });
        }
      );
    }
  );
};

/* ── GET /api/dashboard/payments (joins payments table with user info) ── */
exports.getPayments = (req, res) => {
  db.all(
    `SELECT p.*, (u.firstName || ' ' || u.lastName) as studentName, u.email
     FROM payments p
     JOIN users u ON u.id = p.user_id
     ORDER BY p.id DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    }
  );
};
exports.deleteStudent = (req, res) => {
  const { id } = req.params;
  
  // Attempt to delete from both potential tables for maximum reliability
  db.run("DELETE FROM users WHERE id = ? AND role = 'student'", [id], function (err) {
    if (err) console.error("Error deleting from users:", err);
    
    db.run("DELETE FROM students WHERE id = ?", [id], function (err2) {
      if (err2) console.error("Error deleting from students:", err2);
      
      // If either table had the record, we consider it a success
      res.json({ message: "Delete operation completed" });
    });
  });
};
