const express = require("express");
const Requirement = require("../models/Requirement");

const router = express.Router();

// Create a new requirement
router.post("/", async (req, res) => {
  try {
    const requirement = await Requirement.create(req.body);

    res.status(201).json({
      message: "Requirement created successfully",
      requirement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create requirement",
      error: error.message,
    });
  }
});

// Get all requirements
router.get("/", async (req, res) => {
  try {
    const requirements = await Requirement.find().sort({ createdAt: -1 });

    res.json(requirements);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch requirements",
      error: error.message,
    });
  }
});

module.exports = router;