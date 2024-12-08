const { isTeamParticipated } = require("./team");
const { isRegisteredStadium } = require("./stadium");
const mongoose = require("mongoose");

const MatchModel = require("../models/match");
const SeatsModel = require("../models/seats");
const StadiumModel = require("../models/stadium");

const createMatch = async (req, res, next) => {
  const {
    homeTeam,
    awayTeam,
    venue,
    date,
    time,
    mainReferee,
    firstLinesman,
    secondLinesman,
  } = req.body;
  if (Date.now() > Date(time)) {
    return res
      .status(400)
      .json({ message: "Match date must be in the future." });
  }

  // TODO: keep up with the validations
  try {
    const row = new MatchModel({
      homeTeam,
      awayTeam,
      matchVenue: venue,
      date,
      time,
      mainReferee,
      firstLinesman,
      secondLinesman,
    });
    const tempId = row._id;
    await row.save();
    const stadium = await StadiumModel.findById(venue);
    const { height, width } = stadium; // height = number of rows, width = number of columns

    const seats = [];
    for (let row = 1; row <= height; row++) {
      for (let col = 1; col <= width; col++) {
        seats.push({
          row: row,
          column: col,
          matchId: tempId,
        });
      }
    }
    // Bulk insert seats into the database
    await SeatsModel.insertMany(seats);
    console.log("Seats created successfully.");
    return res.status(200).json({
      message: "Match was successfully created.",
      data: row,
    });
  } catch (err) {
    console.log(err);
    return res.status(405).json({ message: "Failed to create match." });
  }
};

const editMatch = async (req, res, next) => {
  const {
    _id,
    homeTeam,
    awayTeam,
    venue,
    date,
    time,
    mainReferee,
    firstLinesman,
    secondLinesman,
  } = req.body;

  let updateObject = {};

  if (homeTeam) {
    updateObject.homeTeam = homeTeam;
  }

  if (awayTeam) {
    updateObject.awayTeam = awayTeam;
  }

  const match = await MatchModel.findById(_id);
  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }

  if (venue) {
    // Get the new venue details
    const newVenue = await StadiumModel.findById(venue);

    if (!newVenue) {
      return res.status(404).json({ message: "New venue not found." });
    }

    // Get the current venue details
    const currentVenue = await StadiumModel.findOne(match.matchVenue);

    // Compare the rows and columns of the new venue with the current venue
    if (
      newVenue.height < currentVenue.height ||
      newVenue.width < currentVenue.width
    ) {
      return res.status(400).json({
        message:
          "The new venue's size is smaller than the current venue's size.",
      });
    }

    // If the new venue is valid, update the venue in the updateObject

    const newSeats = [];

    // Generate seats based on the new venue's height (rows) and width (columns)
    for (let row = currentVenue.height + 1; row <= newVenue.height; row++) {
      for (let col = currentVenue.width + 1; col <= newVenue.width; col++) {
        newSeats.push({
          row: row,
          column: col,
          matchId: match._id,
          reservationId: null, // Initially, no reservation for any seat
        });
      }
    }

    // Insert new seats into the database
    await SeatsModel.insertMany(newSeats); // Insert newly generated seats for the updated match
    updateObject.matchVenue = venue;
  }

  if (time) {
    updateObject.time = time;
  }
  if (date) {
    updateObject.date = date;
  }

  if (mainReferee) {
    updateObject.mainReferee = mainReferee;
  }

  if (firstLinesman) {
    updateObject.firstLinesman = firstLinesman;
  }

  if (secondLinesman) {
    updateObject.secondLinesman = secondLinesman;
  }

  try {
    const matchRow = await MatchModel.findOneAndUpdate({ _id }, updateObject, {
      new: true,
    });
    if (!matchRow) {
      return res.status(404).json({ message: "Match not found." });
    } else {
      return res.status(200).json({
        message: "Match was successfully updated.",
        data: matchRow,
      });
    }
  } catch (err) {
    return res.status(405).json({ message: "Failed to update match." });
  }
};

const matchDetails = async (req, res, next) => {
  const { matchId } = req.params;
  const matchRow = await MatchModel.findById(matchId);
  const matchSeats = await SeatsModel.aggregate([
    {
      $group: {
        _id: "$matchId",
        seats: {
          $push: {
            seatId: "$_id",
            row: "$row",
            column: "$column",
            isReserved: "$occupied",
          },
        },
      },
    },
  ]).find({ matchId: matchId });

  if (!matchRow) {
    return res.status(404).json({ message: "Match not found." });
  } else {
    return res.status(200).json({
      message: "match was found successfully",
      match: matchRow,
      seats: matchSeats,
    });
  }
};

const getAllMatches = async (req, res, next) => {
  try {
    // Fetch all matches from the database
    const matches = await MatchModel.find().populate(
      "homeTeam awayTeam matchVenue mainReferee firstLinesman secondLinesman"
    );

    if (!matches.length) {
      return res.status(404).json({ message: "No matches found." });
    }

    return res.status(200).json({
      message: "Matches fetched successfully",
      matches,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to retrieve matches." });
  }
};

const fetchSeatingLayout = async (req, res) => {
  const { matchId } = req.params;
  try {
    // Fetch seating data from the database for a specific match

    const seats = await SeatsModel.find({
      matchId: new mongoose.Types.ObjectId(matchId),
    });

    if (!seats) {
      return res.status(404).json({ message: "No seating data found" });
    }

    // Group seats by rows and columns for a better representation
    const rows = Math.max(...seats.map((seat) => seat.row));
    const columns = Math.max(...seats.map((seat) => seat.column));

    const seatingLayout = Array.from({ length: rows }, (_, rowIndex) => {
      return Array.from({ length: columns }, (_, colIndex) => {
        const seat = seats.find(
          (s) => s.row === rowIndex + 1 && s.column === colIndex + 1
        );
        return seat ? seat.reservationId : false; // Default to false if seat is not found
      });
    });

    return res.status(200).json({
      rows,
      columns,
      seats: seatingLayout,
    });
  } catch (err) {
    console.error("Error fetching seating layout:", err);
    return res.status(500).json({ message: "Error fetching seating layout" });
  }
};

module.exports = {
  createMatch,
  editMatch,
  matchDetails,
  getAllMatches,
  fetchSeatingLayout,
};
