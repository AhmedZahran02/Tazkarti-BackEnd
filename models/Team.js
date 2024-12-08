const { Schema, default: mongoose } = require("mongoose");

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const TeamModel = mongoose.model("Teams", TeamSchema);
module.exports = TeamModel;
