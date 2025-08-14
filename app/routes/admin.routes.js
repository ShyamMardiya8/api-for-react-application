const express = require("express")
const { HANDLE_SIGNUP } = require("../controllers/admin.controller")
const adminRoutes = express.Router()


adminRoutes.post('/signup', HANDLE_SIGNUP)



module.exports = adminRoutes