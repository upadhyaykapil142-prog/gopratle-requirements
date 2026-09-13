const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
    },

    category: {
      type: String,
      enum: ["planner", "performer", "crew"],
      required: true,
    },

    categoryDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Requirement", requirementSchema);