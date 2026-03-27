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
    // 🔥 QUERY PARAMS
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    // 🔍 STEP 1: SEARCH USERS
    const userFilter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const users = await User.find(userFilter).select("_id name email");

    const userIds = users.map((u) => u._id);

    // 🔥 STEP 2: FETCH DIETS WITH PAGINATION
    const diets = await Diet.find({
      user: { $in: userIds },
    })
      .populate("user", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // 🔢 TOTAL COUNT (for pagination)
    const total = await Diet.countDocuments({
      user: { $in: userIds },
    });

    // 🔥 STEP 3: FORMAT DATA
    const formatted = diets.map((d) => {
      const entries = d.entries || [];

      const startWeight = entries[0]?.weight || null;
      const currentWeight =
        entries[entries.length - 1]?.weight || null;

      // 📊 PROGRESS CALCULATION
      let progress = 0;
      if (startWeight && d.targetWeight && currentWeight) {
        progress =
          ((startWeight - currentWeight) /
            (startWeight - d.targetWeight)) *
          100;
      }

      return {
        userId: d.user?._id,
        name: d.user?.name,
        email: d.user?.email,

        totalDays: entries.length,
        targetWeight: d.targetWeight,

        startWeight,
        currentWeight,
        progress: Number(progress.toFixed(1)),

        entries: entries.map((e) => ({
          day: e.day,
          weight: e.weight,
          morning: e.morning,
          lunch: e.lunch,
          dinner: e.dinner,
        })),
      };
    });

    // 🔥 STEP 4: TOTAL STATS
    const totalUsers = await User.countDocuments();
    const totalEntries = await Diet.aggregate([
      { $unwind: "$entries" },
      { $count: "total" },
    ]);

    res.json({
      totalUsers,
      totalEntries: totalEntries[0]?.total || 0,

      page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,

      diets: formatted,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🎬 ADD CONTENT
exports.addContent = async (req, res) => {
  try {
    const { type, url, thumbnail } = req.body;

    if (!type || !url) {
      return res.status(400).json({
        message: "Type and URL required",
      });
    }

    const content = new Content({
      type,
      url,
      thumbnail, // ✅ SAVE THUMBNAIL
    });

    await content.save();

    res.json({
      message: "Content added successfully",
      content,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getContent = async (req, res) => {
  const data = await Content.find().sort({ createdAt: -1 });
  res.json(data);
};