const StadiumModel = require("../models/stadium");

const isRegisteredStadium = async (stadiumName) => {
  const stadiumRow = await StadiumModel.findOne({ name: stadiumName });
  return stadiumRow;
};

// Add a new stadium
const addStadium = async (req, res, next) => {
  const { stadiumName, length, width } = req.body;
  const numberOfSeats = length * width;
  if (numberOfSeats <= 0 || length <= 0 || width <= 0) {
    return res.status(400).json({
      message: "Number of seats, length, and width must be positive.",
    });
  }

  const existingStadium = await isRegisteredStadium(stadiumName);
  if (existingStadium) {
    return res.status(409).json({ message: "Stadium already registered." });
  }

  try {
    const newStadium = new StadiumModel({
      name: stadiumName,
      numberOfSeats: numberOfSeats,
      height: length,
      width: width,
    });
    await newStadium.save();

    return res.status(200).json({ message: "Stadium added successfully." });
  } catch (error) {
    return res.status(501).json({ message: "Failed to add stadium." });
  }
};

// Get all stadiums
const getAllStadiums = async (req, res, next) => {
  try {
    const stadiums = await StadiumModel.find();
    return res.status(200).json({
      message: "Stadiums retrieved successfully.",
      stadiums,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving stadiums.", error });
  }
};

module.exports = {
  addStadium,
  getAllStadiums, // Export the getAllStadiums function
};
