"use strict";

const User = require("../models/User.Model");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const [users, total, sozialarbeiter, sozialbetreuer, sozialbetreuerhelfer] =
      await Promise.all([
        User.find({ role: "employee" }).select("-password").lean(),
        User.countDocuments({ role: "employee" }),
        User.countDocuments({ role: "employee", team: "sozialarbeiter" }),
        User.countDocuments({ role: "employee", team: "sozialbetreuer" }),
        User.countDocuments({ role: "employee", team: "sozialbetreuerhelfer" }),
      ]);

    res.json({
      count: { total, sozialarbeiter, sozialbetreuer, sozialbetreuerhelfer },
      users,
    });
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

const updateUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.team = req.body.team || user.team;
    user.workType = req.body.workType || user.workType;

    if (req.body.isActive === "true") {
    } else if (req.body.isActive === "false") {
      user.isActive = false;
    } else {
      user.isActive = user.isActive;
    }

    const updatedUser = await user.save();
    res.json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        team: updatedUser.team,
        workType: updatedUser.workType,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { password, newPassword } = req.body;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!password) {
      return res.status(404).json({ message: "Password cannot be empty" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    const updatedUser = await user.save();
    res.json({
      message: "User password updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        team: updatedUser.team,
        workType: updatedUser.workType,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  updateUserPassword,
  deleteUserById,
};
