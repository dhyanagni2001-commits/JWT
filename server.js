const express = require("express");
const jwt = require("jsonwebtoken");
const users = require("./users");
const { authenticateToken, authorizeRole, SECRET_KEY } = require("./auth");

const app = express();
app.use(express.json());


// Login API (Generate JWT)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ token });
});


// Protected Route (Any logged-in user)
app.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Welcome to your profile",
    user: req.user
  });
});


// Admin Only Route
app.get("/admin", authenticateToken, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
