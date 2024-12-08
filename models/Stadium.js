const { Schema, default: mongoose } = require("mongoose");

const StadiumSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  numberOfSeats: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  }
});

const StadiumModel = mongoose.model("Stadiums", StadiumSchema);
module.exports = StadiumModel;
