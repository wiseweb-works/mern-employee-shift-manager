const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
} = require("../controllers/shiftController");
const router = express.Router();

router.get("/", protect, getShifts);
router.get("/:id", protect, getShiftById);
router.post("/", protect, adminOnly, createShift);
router.put("/:id", protect, adminOnly, updateShift);
router.delete("/:id", protect, adminOnly, deleteShift);

module.exports = router;
