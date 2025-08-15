const jwt = require("jsonwebtoken");
const asyncHandler = require("../util/asyncHandler");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const ApiError = require("../utility/ApiError");
const admin = require("../models/admin.model");
const validator = require("../validators/Field");
const ApiResponse = require("../utility/ApiResponse");
const UserInformation = require("../models/user");
dotenv.config();

const HANDLE_SIGNUP = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.info("🚀 ~ hashedPassword:", hashedPassword);
  const mergedData = { email, password };
  const { isValid, missingFields } = validator(mergedData);
  const missingFieldsError = missingFields.join(", ");
  console.info("🚀 ~ missingFields:", missingFields);
  if (!isValid) {
    throw new ApiError(400, `fill this field ${missingFieldsError}`);
  }

  const adminData = new admin({
    email,
    hashedPassword,
  });

  const createdAdmin = await adminData.save();
  // const generateToken = jwt.sign({id : createdAdmin?._id}, process.env.SECRET_KEY, {
  //     expiresIn : "1h"
  // })

  // const refreshToken = jwt.sign({id : createdAdmin?._id}, process.env.SECRET_KEY, {
  //     expiresIn : "7d"
  // })

  return res
    .status(201)
    .json(new ApiResponse(201, "admin created", { id: createdAdmin._id }));
});

const HANDLE_LOGIN = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await admin.findOne({ email, password });
  console.info("🚀 ~ findUser:", findUser);
  if (!findUser) {
    throw new ApiError(400, "user not found");
  }
  const generateToken = jwt.sign({ id: findUser._id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ id: findUser._id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });

  return res.status(201).json(
    new ApiResponse(201, "successfully login", {
      generateToken,
      refreshToken,
    })
  );
});

const HANDLE_USERS = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const fetchAllUSers = await UserInformation.find({ type });
  if (!type && type === "") {
    throw new ApiError(400, "type is required to search");
  }
  if (!fetchAllUSers) {
    throw new ApiError(400, "invalid type");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "fetched all search results", fetchAllUSers));
});

const HANDLE_USERS_UPDATE = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phoneNumber, email, type } = req.body;
  const { isValid, missingFields } = validator({
    firstName,
    lastName,
    phoneNumber,
    email,
    type,
  });
  const findUser = await UserInformation.findById(id);
  const missingFieldsError = missingFields.join(", ");
  if (!isValid) {
    throw new ApiError(400, missingFieldsError);
  }
  const updatedData = {
    firstName,
    lastName,
    phoneNumber,
    email,
    type,
  };

  const updatedUser = await UserInformation(id, updatedData);

  return res
    .status(200)
    .json(new ApiResponse(200, "user updated", { id: updatedUser._id }));
});

module.exports = {
  HANDLE_SIGNUP,
  HANDLE_LOGIN,
  HANDLE_USERS,
};
