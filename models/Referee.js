const { Schema, default: mongoose } = require("mongoose");

const RefereeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const RefereeModel = mongoose.model("Referees", RefereeSchema);
module.exports = RefereeModel;
