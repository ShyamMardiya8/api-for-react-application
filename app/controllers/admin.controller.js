const jwt = require("jsonwebtoken");
const asyncHandler = require("../utility/asyncHandler");
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { type, firstName } = req.query;

  const startIndex = (page - 1) * limit;
  const value = await UserInformation.find({ type })
    .limit(limit)
    .skip(startIndex)
    .exec();

  const fetchAllUSers = await UserInformation.find({ type, firstName });
  if (!type && type === "") {
    throw new ApiError(400, "type is required to search");
  }
  if (!fetchAllUSers) {
    throw new ApiError(400, "invalid type");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "fetched user Information", value));
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

  const updatedUser = await UserInformation.findByIdAndUpdate(id, updatedData);

  if (!updatedUser) {
    throw new ApiError(400, "user not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "user updated", { id: updatedUser._id }));
});

const HANDLE_USER_DELETE = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const findUserAndDelete = UserInformation.findByIdAndDelete(id);

  if (!findUserAndDelete) {
    throw new ApiError(400, "user not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "user deleted Successfully", {}));
});

const HANDLE_UPLOAD_DATA = asyncHandler(async (req, res) => {
  debugger;
  const { firstName, lastName, phoneNumber, email, type } = req.body;
  const { isValid, missingFields } = validator({
    firstName,
    lastName,
    phoneNumber,
    email,
    type,
  });
  const missingFieldsError = missingFields.join(", ");
  if (!isValid) {
    throw new ApiError(400, missingFieldsError);
  }

  console.info("🚀 ~ files:", req.files);
  if (!req.files) {
    throw new ApiError(400, "File Upload is required");
  }
  const userData = new UserInformation({
    firstName,
    lastName,
    phoneNumber,
    email,
    type,
    file: req.files,
  });
  console.info("🚀 ~ userData:", userData);

  await userData.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "user Created Successfully", { id: userData._id })
    );
});
module.exports = {
  HANDLE_SIGNUP,
  HANDLE_LOGIN,
  HANDLE_USERS,
  HANDLE_USERS_UPDATE,
  HANDLE_USER_DELETE,
  HANDLE_UPLOAD_DATA,
};
