const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// @desc    Get current user's profile
// @route   GET /api/users/me
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get user profile error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @desc    Update user profile (optional)
// @route   PUT /api/users/me
// @access  Private
router.put("/me", auth, async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json({ msg: "Profile updated", user });
  } catch (err) {
    console.error("Update user error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
