
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

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
