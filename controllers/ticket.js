const TicketModel = require("../models/Ticket");
const SeatsModel = require("../models/seats");
const MatchModel = require("../models/match");
const getTickets = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all tickets for the given user, populating match and seat details
    const tickets = await TicketModel.find({ userId })
      .populate({
        path: "matchId",
        populate: [
          { path: "homeTeam", select: "name" },
          { path: "awayTeam", select: "name" },
          { path: "matchVenue", select: "name" },
        ],
      })
      .populate({
        path: "seatId",
        select: "row column reservationId",
      });

    res
      .status(200)
      .json({ message: "Tickets retrieved successfully", tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTicket = async (req, res) => {
  const { ticketId } = req.params;

  try {
    // Find the ticket and related match
    const ticket = await TicketModel.findById(ticketId).populate("matchId");
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    const matchDate = new Date(ticket.matchId.date);
    const currentDate = new Date();
    const daysBeforeMatch = (matchDate - currentDate) / (1000 * 60 * 60 * 24);

    // Check if the ticket can be canceled
    if (daysBeforeMatch <= 3) {
      return res.status(400).json({
        message:
          "Tickets can only be canceled 3 or more days before the match.",
      });
    }

    // Delete the associated seat reservation
    await SeatsModel.findOneAndUpdate(
      { _id: ticket.seatId },
      { reservationId: null },
      { new: true } // Optional: returns the updated document after the update
    );

    // Delete the ticket
    await TicketModel.findByIdAndDelete(ticketId);

    res.status(200).json({ message: "Ticket canceled successfully." });
  } catch (error) {
    console.error("Error canceling ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getTickets, deleteTicket };
