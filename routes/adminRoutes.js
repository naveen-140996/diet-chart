const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getDashboard,
  addContent,
  getContent,
} = require("../controller/adminController");

const { adminProtect } = require("../middleware/adminMiddleware");

// 🔐 LOGIN
router.post("/login", adminLogin);

// 📊 DASHBOARD
router.get("/dashboard", adminProtect, getDashboard);

// 🎬 ADD CONTENT
router.post("/content", adminProtect, addContent);

// 📺 GET CONTENT (USER SIDE)
router.get("/content", getContent);

module.exports = router;