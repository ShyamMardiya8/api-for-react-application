const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "UserInformation",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Leave"],
  },
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  totalHours: { type: Number },
});

attendanceSchema.pre("save", function (next) {
  if (this.checkIn && this.checkOut) {
    const diffMs = this.checkOut - this.checkIn;
    this.totalHours = diffMs / (100 * 60 * 60);
  }
  next();
});

const attendanceModel = mongoose.model("Attendance", attendanceSchema);
module.exports = attendanceModel;
