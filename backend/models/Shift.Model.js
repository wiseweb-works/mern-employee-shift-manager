"use strict";

const mongoose = require("mongoose");

const ShiftSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shift", ShiftSchema);
