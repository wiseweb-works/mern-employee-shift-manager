const User = require("../models/User.Model");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const [users, count] = await Promise.all([
      User.find({ role: "employee" }).select("-password").lean(),
      User.countDocuments({ role: "employee" }),
    ]);

    res.json({ count, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
};
