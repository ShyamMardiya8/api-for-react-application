const express = require("express");
const {
  HANDLE_SIGNUP,
  HANDLE_LOGIN,
  HANDLE_USERS,
} = require("../controllers/admin.controller");
const verifyToken = require("../middleware/token.middleware");
const adminRoutes = express.Router();

adminRoutes.post("/signup", HANDLE_SIGNUP);
adminRoutes.post("/login", HANDLE_LOGIN);
adminRoutes.get("/users", HANDLE_USERS);
adminRoutes.put("/users", HANDLE_USERS_UPDATE);

module.exports = adminRoutes;
