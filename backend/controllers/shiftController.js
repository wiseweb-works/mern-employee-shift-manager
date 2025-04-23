"use strict";

const Shift = require("../models/Shift.Model");
const moment = require("moment-timezone");

const getShifts = async (req, res) => {
  const { start } = req?.query || {};

  try {
    let shifts;
    let count;

    const startOfMonth = moment(start).startOf("month").toDate();
    const endOfMonth = moment(start).endOf("month").toDate();

    if (req.user.role === "admin") {
      shifts = await Shift.find({
        start: { $gte: startOfMonth, $lte: endOfMonth },
      })
        .populate({
          path: "employee",
          select: "name email team workType",
          options: { lean: true },
        })
        .lean();
      count = await Shift.countDocuments({
        start: { $gte: startOfMonth, $lte: endOfMonth },
      }).lean();
    } else {
      shifts = await Shift.find({
        employee: req.user._id,
      })
        .populate({
          path: "employee",
          select: "name email",
          options: { lean: true },
        })
        .lean();
      count = await Shift.countDocuments({
        employee: req.user._id,
      }).lean();
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
    let shiftsData = Array.isArray(req.body) ? req.body : [req.body];

    const invalidShifts = shiftsData.filter(
      ({ start, end }) => !isValidISODate(start) || !isValidISODate(end)
    );

    if (invalidShifts.length > 0) {
      return res.status(400).json({
        message: "All start and end values must be valid ISODate objects",
      });
    }

    const createdShifts = await Shift.insertMany(shiftsData);

    res
      .status(201)
      .json({ message: "Shifts created successfully", shifts: createdShifts });
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
    shift.start = req.body.start || shift.start;
    shift.end = req.body.end || shift.end;
    shift.notes = req.body.notes || shift.notes;

    if (req.body.start || req.body.end) {
      if (!isValidISODate(shift.start) || !isValidISODate(shift.end)) {
        return res
          .status(400)
          .json({ message: "start and end must valid ISODate object" });
      }
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

const deleteShiftsByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res
        .status(400)
        .json({ message: "year ve month parameters is required" });
    }

    const startOfMonth = moment(`${year}-${month}-01`)
      .startOf("month")
      .toDate();
    const endOfMonth = moment(`${year}-${month}-01`).endOf("month").toDate();

    const result = await Shift.deleteMany({
      start: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.json({
      message: `${result.deletedCount} shifts deleted`,
    });
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
  deleteShiftsByMonth,
};

const isValidISODate = (isoString) => {
  return moment(isoString, moment.ISO_8601, true).isValid();
};
