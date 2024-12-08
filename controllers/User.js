const UserModel = require("../models/user");
const UsersModel = require("../models/user");

const getUsers = async (req, res, next) => {
  try {
    // Find all users where the role is not 'admin'
    const users = await UsersModel.find({ role: { $ne: "admin" } });

    return res
      .status(200)
      .json({ message: "Users retrieved successfully", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update user data
const updateUser = async (req, res, next) => {
  const { _id, username, email, firstName, lastName, birthDate, gender, city } =
    req.body; // Fields to update
  let updateObject = {};

  if (username) {
    updateObject.username = username;
  }

  if (email) {
    updateObject.email = email;
  }

  if (firstName) {
    updateObject.firstName = firstName;
  }

  if (lastName) {
    updateObject.lastName = lastName;
  }
  if (birthDate) {
    updateObject.birthDate = birthDate;
  }

  if (gender) {
    updateObject.gender = gender;
  }

  if (city) {
    updateObject.city = city;
  }

  try {
    const userRow = await UserModel.findOneAndUpdate({ _id }, updateObject, {
      new: true,
    });

    if (!userRow) {
      return res.status(404).json({ message: "User not found." });
    } else {
      return res.status(200).json({
        message: "User was successfully updated.",
        user: {
          _id: userRow._id,
          username: userRow.username,
          email: userRow.email,
          userType: userRow.role,
          name: userRow.firstName + " " + userRow.lastName,
          firstName: userRow.firstName,
          lastName: userRow.lastName,
          birthDate: userRow.birthDate,
          gender: userRow.gender,
          city: userRow.city,
          address: userRow.address,
        },
      });
    }
  } catch (err) {
    return res.status(405).json({ message: "Failed to update user." });
  }
};

module.exports = {
  getUsers,
  updateUser,
};
