const { Schema, default: mongoose } = require("mongoose");

const MatchSchema = new Schema({
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the TeamModel
    ref: "Teams",
    required: true,
  },

  awayTeam: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the TeamModel
    ref: "Teams",
    required: true,
    validate: {
      validator: function (value) {
        return value.toString() !== this.homeTeam.toString(); // Ensure home and away teams are not the same
      },
      message: "Home and Away teams must be different.",
    },
  },

  matchVenue: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the StadiumModel
    ref: "Stadiums",
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  time: {
    type: String, // Time in HH:mm format
    required: true,
  },

  mainReferee: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the RefereeModel
    ref: "Referees",
    required: true,
  },

  firstLinesman: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the RefereeModel
    ref: "Referees",
    required: true,
  },

  secondLinesman: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the RefereeModel
    ref: "Referees",
    required: true,
  },
});

// Create the model
const MatchModel = mongoose.model("Match", MatchSchema);

module.exports = MatchModel;
