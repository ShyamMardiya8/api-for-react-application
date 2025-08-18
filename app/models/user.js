const mongoose = require("mongoose");

const userInformationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["Teacher", "Student", "Admin"],
    required: true,
    trim: true,
  },
  file: {
    type: Array,
    required: true,
  },
});

const UserInformation = mongoose.model(
  "UserInformation",
  userInformationSchema
);

module.exports = UserInformation;
