const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { saveDiet, getDiet, updateDay } = require("../controller/dietController");

router.post("/save", protect, saveDiet);
router.get("/", protect, getDiet);
router.put("/update", protect, updateDay);
router.delete("/delete", protect, deleteDay);

module.exports = router;