const { Schema, default: mongoose } = require("mongoose");

const SeatsSchema = new Schema({
  row: {
    type: Number,
    required: true,
  },
  column: {
    type: Number,
    required: true,
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
  },
  reservationId: {
    type: String,
    default: null,
  },
});

const SeatsModel = mongoose.model("Seats", SeatsSchema);
module.exports = SeatsModel;
