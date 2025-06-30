// server/controllers/userController.js

const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).send("Server error");
  }
};

exports.updateUserProfile = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json({ msg: "Profile updated", user });
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).send("Server error");
  }
};
