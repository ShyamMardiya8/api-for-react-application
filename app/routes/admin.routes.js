const express = require("express");
const {
  HANDLE_SIGNUP,
  HANDLE_LOGIN,
  HANDLE_USERS,
  HANDLE_USERS_UPDATE,
  HANDLE_USER_DELETE,
  HANDLE_UPLOAD_DATA,
} = require("../controllers/admin.controller");
const verifyToken = require("../middleware/token.middleware");
const appLimiter = require("../middleware/apiLimiter.middleware");
const uploads = require("../middleware/multer.middleware");
const adminRoutes = express.Router();

adminRoutes.post("/signup", HANDLE_SIGNUP);
adminRoutes.post("/login", HANDLE_LOGIN);
adminRoutes.get("/users", verifyToken, appLimiter, HANDLE_USERS);
adminRoutes.put("/users/:id", verifyToken, appLimiter, HANDLE_USERS_UPDATE);
adminRoutes.delete("/users/:id", verifyToken, appLimiter, HANDLE_USER_DELETE);
adminRoutes.post(
  "/uploads",
  verifyToken,
  uploads.array("file", 5),
  HANDLE_UPLOAD_DATA
);

module.exports = adminRoutes;
