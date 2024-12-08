const { Schema, default: mongoose } = require("mongoose");

const TicketSchema = new Schema({
  seatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seats",
    required: true,
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

const TicketModel = mongoose.model("Ticket", TicketSchema);
module.exports = TicketModel;
