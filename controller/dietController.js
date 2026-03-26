const Diet = require("../models/Diet");

exports.saveDiet = async (req, res) => {
  try {
    const { morning, lunch, dinner, weight, targetWeight } = req.body;

    let diet = await Diet.findOne({ user: req.user._id });

    if (!diet) {
      diet = new Diet({
        user: req.user._id,
        targetWeight,
        entries: [],
      });
    }

    const day = diet.entries.length + 1;

    diet.entries.push({
      day,
      morning,
      lunch,
      dinner,
      weight,
    });

    if (targetWeight) {
      diet.targetWeight = targetWeight;
    }

    await diet.save();

    res.json({ message: "Saved successfully ✅", diet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDiet = async (req, res) => {
  try {
    const diet = await Diet.findOne({ user: req.user._id });

    res.json({ diet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDay = async (req, res) => {
  try {
    const { index, data } = req.body;

    const diet = await Diet.findOne({ user: req.user._id });

    diet.entries[index] = data;

    await diet.save();

    res.json({ message: "Updated ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};