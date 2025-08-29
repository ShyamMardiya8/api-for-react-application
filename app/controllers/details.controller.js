const attendanceModel = require("../models/attendance.model");
const ApiError = require("../utility/ApiError");
const ApiResponse = require("../utility/ApiResponse");
const asyncHandler = require("../utility/asyncHandler");

const detailsObject = {
  GET_ALL_DETAILS: asyncHandler(async (req, res) => {
    const { id } = req.query;
    const record = await attendanceModel
      .find(id ? { userId: id } : {})
      .populate(
        "userId",
        "firstName",
        "lastName",
        "phoneNumber",
        "email",
        "type"
      );
    if (!record) {
      throw new ApiError(400, "user not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "fetched successfully", record));
  }),
};

module.exports = detailsObject;
