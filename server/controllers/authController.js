
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.signup = async (req, res) => {
  const { 
    email, password, firstName, lastName, middleName, 
    phoneNumber, city, country 
  } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const avatar = firstName ? firstName.charAt(0).toUpperCase() : "?";

  db.run(
    `INSERT INTO users (
      email, password, firstName, lastName, middleName, 
      phoneNumber, city, country, avatar, role
    ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      email, hash, firstName || null, lastName || null, middleName || null, 
      phoneNumber || null, city || null, country || null, avatar, 'student'
    ],
    function(err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Signup success" });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, user) => {
      if (!user) return res.status(400).json({ message: "User not found" });

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" }
      );

      res.json({ 
        token, 
        user: { 
          email: user.email, 
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName 
        } 
      });
    }
  );
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, user) => {
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    db.run("UPDATE users SET resetToken=?, resetTokenExpiry=? WHERE email=?", [resetToken, expiry, email], async function(err) {
      if (err) return res.status(500).json({ message: err.message });

      try {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        const resetUrl = `http://localhost:5173/login?resetToken=${resetToken}`;
        const info = await transporter.sendMail({
          from: '"PYQs Admin" <admin@pyqs.com>',
          to: email,
          subject: "Password Reset Request",
          text: `You requested a password reset. Please click this link to reset your password: ${resetUrl}`,
          html: `<p>You requested a password reset. Please click this link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
        });

        console.log("------------------------------------------");
        console.log("Password Reset Email Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log("------------------------------------------");

        res.json({ message: "Reset link sent to your email!" });
      } catch (emailErr) {
        res.status(500).json({ message: "Failed to send email." });
      }
    });
  });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: "Token and new password required" });
  
  const now = new Date().toISOString();

  db.get("SELECT * FROM users WHERE resetToken=? AND resetTokenExpiry > ?", [token, now], async (err, user) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hash = await bcrypt.hash(newPassword, 10);
    db.run("UPDATE users SET password=?, resetToken=NULL, resetTokenExpiry=NULL WHERE id=?", [hash, user.id], function(err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Password updated successfully." });
    });
  });
};
