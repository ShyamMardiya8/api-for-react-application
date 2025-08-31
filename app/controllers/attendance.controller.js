const attendanceModel = require("../models/attendance.model");
const UserInformation = require("../models/user");
const ApiError = require("../utility/ApiError");
const ApiResponse = require("../utility/ApiResponse");
const asyncHandler = require("../utility/asyncHandler");

const attendanceObject = {
  GET_ATTENDANCE: asyncHandler(async (req, res) => {
    const { id } = req.query;
    const findAttendance = await attendanceModel.findById(id);
    if (!findAttendance) {
      throw new ApiError(400, "user not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "user found", findAttendance));
  }),
  HANDLE_ATTENDANCE: asyncHandler(async (req, res) => {
    const { id } = req.query;
    const { userId, date, status, checkIn } = req.body;
    const getUserId = await UserInformation.findById(id);
    if (!getUserId) {
      throw new ApiError(400, "user not found");
    }
    const attendanceData = new attendanceModel({
      userId,
      date,
      status,
      checkIn,
      checkOut: null,
      totalHours: 0,
    });

    const createdData = await attendanceData.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "user created", createdData));
  }),
  HANDLE_CHECKOUT: asyncHandler(async (req, res) => {
    const { userId, date, checkOut } = req.body;
    const record = await attendanceModel.findOne({
      userId,
      date,
    });
    console.info("🚀 ~ record:", record);
    if (!record) {
      throw new ApiError(400, "no check found for today");
    }
    record.checkOut = checkOut;
    console.info("🚀 ~ record:", record);
    if (record.checkIn) {
      const diffMs = new Date(checkOut) - new Date(record.checkIn);
      record.totalHours = diffMs / (1000 * 60 * 60);
    }
    const updatedData = await record.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "check out successfully", updatedData));
  }),
};

module.exports = attendanceObject;
