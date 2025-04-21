"use strict";

const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const {
  getUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  updateUserPassword,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, adminOnly, updateUserById);
router.put("/", protect, updateUserPassword);
router.delete("/:id", protect, adminOnly, deleteUserById);

module.exports = router;
