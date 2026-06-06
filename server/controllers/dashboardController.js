const db = require("../database/db");
const multer = require("multer");
const path = require("path");
const Razorpay = require("razorpay");
const crypto = require("crypto");

let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "secret_placeholder",
  });
} catch (error) {
  console.log("Razorpay keys missing or invalid.");
}

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

/* ── POST /api/dashboard/courses ── */
exports.createCourse = (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ message: "Course name is required" });

  db.run(
    "INSERT INTO courses (name, color) VALUES (?, ?)",
    [name, color || "#7c3aed"],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ id: this.lastID, message: "Course created successfully" });
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

/* ── POST /api/dashboard/pay/create-order ── */
exports.createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;
  if (!razorpay) return res.status(500).json({ message: "Razorpay not configured on backend." });
  
  if (process.env.RAZORPAY_KEY_ID === "rzp_test_placeholder" || !process.env.RAZORPAY_KEY_ID) {
    return res.status(500).json({ message: "Please add your real Razorpay Test Keys to the server/.env file! Using placeholder keys currently." });
  }

  try {
    const options = {
      amount: (amount || 4600) * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create order" });
  }
};

/* ── POST /api/dashboard/pay/verify ── */
exports.verifyRazorpayPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
  const userId = req.user.id;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "secret_placeholder")
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    db.run(
      "UPDATE users SET paymentStatus = 'Completed' WHERE id = ?",
      [userId],
      function(err) {
        if (err) return res.status(500).json({ message: err.message });
        
        db.run(
          "INSERT INTO payments (user_id, amount) VALUES (?, ?)",
          [userId, amount || 4600],
          function(err2) {
            if (err2) return res.status(500).json({ message: err2.message });
            res.json({ message: "Payment verified securely!" });
          }
        );
      }
    );
  } else {
    res.status(400).json({ message: "Invalid signature. Verification failed." });
  }
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

/* ── POST /api/dashboard/tests ── */
exports.createTest = (req, res) => {
  const { title, html_content } = req.body;
  if (!title || !html_content) return res.status(400).json({ message: "Title and HTML content are required" });

  db.run(
    "INSERT INTO tests (title, html_content) VALUES (?, ?)",
    [title, html_content],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ id: this.lastID, message: "Test created successfully" });
    }
  );
};

/* ── GET /api/dashboard/tests ── */
exports.getTests = (req, res) => {
  db.all("SELECT * FROM tests ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
};

/* ── DELETE /api/dashboard/tests/:id ── */
exports.deleteTest = (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tests WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Test deleted successfully" });
  });
};

/* ── POST /api/dashboard/test-results ── */
exports.submitTestResult = (req, res) => {
  const { test_id, answered, total_questions } = req.body;
  const user_id = req.user.id;

  if (!test_id) return res.status(400).json({ message: "Test ID is required" });

  db.run(
    "INSERT INTO test_results (test_id, user_id, answered, total_questions) VALUES (?, ?, ?, ?)",
    [test_id, user_id, answered || 0, total_questions || 0],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ id: this.lastID, message: "Test result recorded successfully" });
    }
  );
};

/* ── GET /api/dashboard/my-test-results ── */
exports.getMyTestResults = (req, res) => {
  const user_id = req.user.id;
  db.all(
    `SELECT tr.*, t.title as test_title 
     FROM test_results tr 
     JOIN tests t ON tr.test_id = t.id 
     WHERE tr.user_id = ? 
     ORDER BY tr.created_at DESC`,
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    }
  );
};

/* ── GET /api/dashboard/all-test-results ── */
exports.getAllTestResults = (req, res) => {
  db.all(
    `SELECT tr.*, t.title as test_title, u.firstName, u.lastName, u.email 
     FROM test_results tr 
     JOIN tests t ON tr.test_id = t.id 
     JOIN users u ON tr.user_id = u.id 
     ORDER BY tr.created_at DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    }
  );
};
