const SeatsModel = require("../models/seats");
const TicketModel = require("../models/Ticket");
const crypto = require("crypto");

const mongoose = require("mongoose");

const getMatchSeats = async (req, res, next) => {
  const { matchId } = req.params;

  if (!matchId) {
    return res.status(400).json({ message: "Missing match id" });
  }
  try {
    const seats = await SeatsModel.find({ matchId });

    return res.status(200).json({ seats, message: "ok" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const generateReservationId = (matchId, row, column) => {
  const rawString = `${matchId}-${row}-${column}-${Date.now()}`;
  const hash = crypto.createHash("sha256").update(rawString).digest("base64");
  return hash.replace(/[^a-zA-Z0-9]/g, "").substring(0, 10); // Keep only alphanumeric and trim to 10 characters
};

const reserveSeat = async (req, res, next) => {
  const { userId, row, column, matchId, cardNumber, pinNumber } = req.body;

  if (!userId || !matchId || !row || !column || !cardNumber || !pinNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const seatObject = await SeatsModel.findOne({
    row: row,
    column: column,
    matchId: new mongoose.Types.ObjectId(matchId),
  });
  if (!seatObject) {
    return res.status(404).json({ message: "Seat not found" });
  }
  console.log(seatObject);

  const ticketId = generateReservationId(matchId, row, column);

  if (seatObject.reservationId !== null) {
    return res.status(409).json({ message: "Seat already reserved" });
  }

  try {
    seatObject.reservationId = ticketId;
    const seatId = seatObject._id;
    tempMatchId = new mongoose.Types.ObjectId(matchId);
    tempUserId = new mongoose.Types.ObjectId(userId);

    const row = new TicketModel({
      seatId: seatId,
      matchId: tempMatchId,
      userId: tempUserId,
    });
    await row.save();
    await seatObject.save();
    return res
      .status(200)
      .json({ message: "Seat reserved successfully", ticketId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const cancelReservation = async (req, res, next) => {
  const { seatId } = req.params;
  const user = req.user;

  if (!seatId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const seatObject = await SeatsModel.findById(seatId);
  if (!seatObject) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (!seatObject.reservationId) {
    return res.status(204).json({ message: "Seat is not reserved" });
  }

  try {
    seatObject.reservationId = null;
    await seatObject.save();
    return res
      .status(200)
      .json({ message: "Seat reservation cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = {
  getMatchSeats,
  reserveSeat,
  cancelReservation,
};
