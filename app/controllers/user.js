const userInformation = require("../models/user");
const asyncHandler = require("../util/asyncHandler");
const ApiError = require("../utility/ApiError");
const ApiResponse = require("../utility/ApiResponse");
const validator = require("../validators/Field");

const GET_USER_INFORMATION = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const startIndex = (page - 1) * limit;
  const value = await userInformation
    .find()
    .limit(limit)
    .skip(startIndex)
    .exec();
  return res
    .status(200)
    .json(new ApiResponse(200, "fetched user Information", value));
});

const POST_USER_INFORMATION = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, email } = req.body;

  const { isValid, missingFields } = validator({
    firstName,
    lastName,
    phoneNumber,
    email,
  });

  if (!isValid) {
    throw new ApiError(
      400,
      `Sorry you missed some field(s): ${missingFields.join(", ")}`
    );
  }

  const userData = new userInformation({
    firstName,
    lastName,
    phoneNumber,
    email,
  });

  await userData.save();
  return res
    .status(201)
    .json(new ApiResponse(201, "User Created Successfully", userData));
});

const UPDATE_USER_INFORMATION = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, email } = req.body;
  const { id } = req.params;
  const { isValid, missingFields } = validator({
    firstName,
    lastName,
    phoneNumber,
    email,
  });
  if (!isValid) {
    throw new ApiError(
      400,
      `please fill missing field ${missingFields.join(", ")}`
    );
  }
  const userData = {
    firstName,
    lastName,
    phoneNumber,
    email,
  };
  const updatedAccount = await userInformation.findByIdAndUpdate(id, userData);
  return res
    .status(201)
    .json(new ApiResponse(200, "user updated successfully", updatedAccount));
});

const DELETE_USER_INFORMATION = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await userInformation.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, "user deleted successFully"));
});

const HANDLE_SEARCH_HEADERS = asyncHandler(async (req, res) => {
  const { name, email } = req.query;
  if ((!name || name.trim() === "") && (!email || email.trim() === "")) {
    throw new ApiError(400, "Search Term is required");
  }

  const query = [];

  if (name) {
    query.push({ firstName: { $regex: name, $options: "i" } });
  }

  if (email) {
    query.push({ email: { $regex: email, $options: "i" } });
  }

  const users = await userInformation.find(query.length ? { $or: query } : {});

  return res.status(202).json(new ApiResponse(200, "search Results", users));
});

const GET_USER_INFORMATION_BY_ID = asyncHandler (async (req, res) => {
  const id = req.params.id;
  const findUserByIds = await userInformation.findById(id)
  if (!findUserByIds) {
    throw new ApiError(400, "user not found")
  }
  return res.status(202).json(new ApiResponse(202, "user found", findUserByIds))
})

module.exports = {
  GET_USER_INFORMATION,
  POST_USER_INFORMATION,
  UPDATE_USER_INFORMATION,
  DELETE_USER_INFORMATION,
  HANDLE_SEARCH_HEADERS,
  GET_USER_INFORMATION_BY_ID
};
