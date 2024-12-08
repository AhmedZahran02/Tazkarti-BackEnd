const { Schema, default: mongoose } = require("mongoose");
const { EG_CITIES } = require("../utils/constants");

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthDate: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  city: {
    type: String,
    enum: EG_CITIES,
    required: true,
  },
  address: {
    type: String,
    required: false,
    default: "",
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["manager", "fan", "admin"],
    default: "fan",
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const UserModel = mongoose.model("Users", UserSchema);
module.exports = UserModel;
