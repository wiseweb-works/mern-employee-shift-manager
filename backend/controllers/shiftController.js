const Shift = require("../models/Shift.Model");

const isValidISODate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime());
};

const getShifts = async (req, res) => {
  try {
    let shifts;
    let count;

    if (req.user.role === "admin") {
      shifts = await Shift.find().populate("employee", "name email");
      count = await Shift.countDocuments();
    } else {
      shifts = await Shift.find({
        employee: req.user._id,
      }).populate("employee", "name email");
      count = await Shift.countDocuments({
        employee: req.user._id,
      });
    }

    res.json({
      count,
      shifts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getShiftById = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id).populate(
      "employee",
      "name email"
    );

    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.json(shift);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const createShift = async (req, res) => {
  try {
    const { employee, startTime, endTime, notes } = req.body;

    if (!isValidISODate(startTime) || !isValidISODate(endTime)) {
      return res
        .status(400)
        .json({ message: "startTime and endTime must valid ISODate object" });
    }

    const shift = await Shift.create({
      employee,
      startTime,
      endTime,
      notes,
    });

    res.status(201).json({ message: "Shift created successfully", shift });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateShift = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    shift.employee = req.body.employee || shift.employee;
    shift.startTime = req.body.startTime || shift.startTime;
    shift.endTime = req.body.endTime || shift.endTime;
    shift.notes = req.body.notes || shift.notes;

    if (req.body.startTime || req.body.endTime) {
      if (!isValidISODate(startTime) || !isValidISODate(endTime)) {
        return res
          .status(400)
          .json({ message: "startTime and endTime must valid ISODate object" });
      }
      shift.employee = req.body.employee;
    }

    const updatedShift = await shift.save();
    res.json({ message: "Shift updated successfully", shift: updatedShift });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    await shift.deleteOne();
    res.json({ message: "Shift deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
};
