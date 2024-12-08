require("mongoose");
const UserModel = require("../models/user");
const { createJWTToken } = require("../utils/lib");
const { EG_CITIES } = require("../utils/constants");
const bcrypt = require("bcrypt");
const { JWT_SECRET, JWT_EXPIRATION } = process.env; // Define secret and expiration in your .env file

const passwordValidator = require("password-validator");

// Create a schema for password validation
const schema = new passwordValidator();
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(20) // Maximum length 20
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits() // Must have at least one digit
  .has()
  .not()
  .spaces(); // Should not have spaces
// const PendingModel = require("../models/Pending")

const approvNewUser = async (req, res, next) => {
  const { username } = req.params;
  if (!username) {
    return res.status(400).json({ message: "Missing user id" });
  }
  const userRow = await UserModel.findOneAndUpdate(
    { username },
    { isActive: true },
    { new: true }
  );
  if (!userRow) {
    return res.status(404).json({ message: "User Was Found" });
  }
  return res.status(200).json({ message: "user was successfully activated" });
};

const removeUser = async (req, res, next) => {
  const { username } = req.params;
  if (!username) {
    return res.status(400).json({ message: "Missing user id" });
  }
  user = await UserModel.findOneAndDelete({ username });

  if (!user) {
    return res.status(204).json({ message: "User was not found" });
  }

  return res.status(201).json({ message: "User was successfully deleted" });
};

const registerUser = async (req, res, next) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    birthDate,
    gender,
    city,
    address,
    role,
  } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !birthDate ||
    !gender ||
    !role ||
    !city
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate password strength
  if (!schema.validate(password)) {
    return res.status(400).json({
      message:
        "Password is weak. It must be 8-20 characters long, contain uppercase, lowercase, and digits, and have no spaces.",
    });
  }

  try {
    // Check if the username already exists
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Check if the email already exists
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword, // Save the hashed password
      firstName,
      lastName,
      birthDate,
      gender,
      city,
      address,
      role,
      isActive: false,
    });

    // Save the user
    await newUser.save();

    return res.status(201).json({ message: "User was saved successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: error.message });
  }
};

const signIn = async (req, res, next) => {
  const { credential, password } = req.body; // Use a single 'credential' field

  // Validate input
  if (!credential) {
    return res.status(400).json({ message: "Missing email or username" });
  }

  if (!password) {
    return res.status(400).json({ message: "Missing password" });
  }

  try {
    // Determine whether the credential is an email or a username
    const isEmail = credential.includes("@");
    const searchObject = isEmail
      ? { email: credential }
      : { username: credential };

    // Find the user in the database
    const user = await UserModel.findOne(searchObject);
    if (!user) {
      return res.status(404).json({ message: "User was not found" });
    }

    if (!user.isActive) {
      return res.status(402).json({ message: "User is not active" });
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const jwt = await createJWTToken({
      _id: user._id,
      username: user.username,
      role: user.role,
    });

    // Respond with the token and user details
    return res.status(200).json({
      message: "ok",
      token: jwt.token,
      userType: user.role,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        userType: user.role,
        name: user.firstName + " " + user.lastName,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        gender: user.gender,
        city: user.city,
        address: user.address,
      },
    });
  } catch (err) {
    console.error("Error during sign-in:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCities = async (req, res, next) => {
  return res.status(200).json({
    message: "ok",
    data: EG_CITIES,
  });
};

module.exports = {
  approvNewUser,
  removeUser,
  registerUser,
  signIn,
  getCities,
};
