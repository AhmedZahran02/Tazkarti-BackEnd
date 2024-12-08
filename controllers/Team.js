const TeamModel = require("../models/team");

// Check if a team has participated
const isTeamParticipated = async (teamName) => {
  const teamRow = await TeamModel.findOne({ name: teamName });
  return teamRow && teamRow["participated"];
};

// Add a new team
const addTeam = async (req, res, next) => {
  const { teamName } = req.body;

  if (!teamName) {
    return res.status(400).json({ message: "Team name is required" });
  }

  try {
    const newTeam = new TeamModel({ name: teamName });
    await newTeam.save();
    return res
      .status(200)
      .json({ message: "Team added successfully", team: newTeam });
  } catch (error) {
    return res.status(500).json({ message: "Error adding team", error });
  }
};

// Get all teams
const getAllTeams = async (req, res, next) => {
  try {
    const teams = await TeamModel.find(); // Fetch all teams from the database
    return res.status(200).json({
      message: "Teams retrieved successfully.",
      teams,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving teams", error });
  }
};

module.exports = {
  isTeamParticipated,
  addTeam,
  getAllTeams, // Export the new getAllTeams function
};
