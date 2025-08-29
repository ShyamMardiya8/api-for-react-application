const express = require("express");
const attendanceObject = require("../controllers/attendance.controller");

const route = express.Router();

route.get("/attend", attendanceObject.GET_ATTENDANCE);
route.post("/attend", attendanceObject.HANDLE_ATTENDANCE);
route.post("/checkOut", attendanceObject.HANDLE_CHECKOUT);

module.exports = route;
