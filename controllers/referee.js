const RefereeModel = require("../models/referee"); // Adjust the path to your Referee model

// Function to get referees with the role 'Main Referee'
const getMainReferees = async (req, res, next) => {
  try {
    // Fetch all referees with role 'Main Referee'
    const mainReferees = await RefereeModel.find({ role: "Main Referee" });
    return res.status(200).json({
      message: "Main referees retrieved successfully",
      referees: mainReferees,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving main referees", error });
  }
};

// Function to get referees with the role 'Linesman'
const getLinesmen = async (req, res, next) => {
  try {
    // Fetch all referees with role 'Linesman'
    const linesmen = await RefereeModel.find({ role: "Linesman" });
    return res
      .status(200)
      .json({ message: "Linesmen retrieved successfully", referees: linesmen });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving linesmen", error });
  }
};

// Function to add a new referee
const addReferee = async (req, res, next) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ message: "Name and role are required" });
  }

  try {
    // Check if the referee already exists
    const existingReferee = await RefereeModel.findOne({ name });
    if (existingReferee) {
      return res.status(400).json({ message: "Referee already exists" });
    }

    // Create and save the new referee
    const newReferee = new RefereeModel({ name, role });
    await newReferee.save();

    return res
      .status(200)
      .json({ message: "Referee added successfully", referee: newReferee });
  } catch (error) {
    return res.status(500).json({ message: "Error adding referee", error });
  }
};

module.exports = {
  addReferee,
  getMainReferees,
  getLinesmen,
};
