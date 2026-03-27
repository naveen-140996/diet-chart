const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Diet = require("../models/Diet");
const Content = require("../models/Content");

// 🔐 ADMIN LOGIN
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
};

// 📊 DASHBOARD DATA
exports.getDashboard = async (req, res) => {
  try {
    const users = await User.find();
    const diets = await Diet.find().populate("user");

    const formatted = diets.map((d) => {
      const entries = d.entries || [];

      const startWeight = entries[0]?.weight || null;
      const currentWeight =
        entries[entries.length - 1]?.weight || null;

      return {
        userId: d.user?._id,
        name: d.user?.name,
        email: d.user?.email,

        totalDays: entries.length,
        targetWeight: d.targetWeight,

        startWeight,
        currentWeight,

        entries: entries.map((e) => ({
          day: e.day,
          weight: e.weight,
          morning: e.morning,
          lunch: e.lunch,
          dinner: e.dinner,
        })),
      };
    });

    const totalEntries = diets.reduce(
      (acc, d) => acc + d.entries.length,
      0
    );

    res.json({
      totalUsers: users.length,
      totalEntries,
      diets: formatted,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🎬 ADD CONTENT
exports.addContent = async (req, res) => {
  try {
    const { type, url } = req.body;

    const content = new Content({ type, url });
    await content.save();

    res.json({ message: "Content added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📺 GET CONTENT
exports.getContent = async (req, res) => {
  const data = await Content.find();
  res.json(data);
};