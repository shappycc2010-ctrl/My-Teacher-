import express from "express";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();

const USERS_FILE = "./users.json";
function loadUsers(){ if(!fs.existsSync(USERS_FILE)) return {}; try { return JSON.parse(fs.readFileSync(USERS_FILE,"utf8")); } catch { return {}; } }
function saveUsers(u){ fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2)); }

// Register
router.post("/api/auth/register", async (req, res) => {
  const { username, password, role = "student" } = req.body;
  const users = loadUsers();
  if (users[username]) return res.status(400).json({ error: "User exists" });
  const hash = await bcrypt.hash(password, 10);
  users[username] = { username, password: hash, role, createdAt: new Date().toISOString() };
  saveUsers(users);
  res.json({ success: true });
});

// Login
router.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users[username];
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, username: user.username, role: user.role });
});

// Middleware to protect routes
export function authMiddleware(req, res, next){
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing token" });
  const [, token] = auth.split(" ");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export default router;
