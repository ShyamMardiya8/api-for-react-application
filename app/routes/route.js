const express = require("express")
const { GET_USER_INFORMATION, POST_USER_INFORMATION, UPDATE_USER_INFORMATION, DELETE_USER_INFORMATION, HANDLE_SEARCH_HEADERS } = require("../controllers/user")
const { USER_REGISTER, LOGIN_USER, LOGIN_REFRESH } = require("../controllers/auth.controller")
const verifyToken = require("../middleware/token.middleware")
const appLimiter = require("../middleware/apiLimiter.middleware")

const route = express.Router()


route.get('/user',verifyToken,appLimiter, GET_USER_INFORMATION)
route.post('/user', POST_USER_INFORMATION)
route.put('/user/:id', UPDATE_USER_INFORMATION)
route.delete('/user/:id', DELETE_USER_INFORMATION)
route.post('/register', USER_REGISTER)
route.post('/login', LOGIN_USER)
route.post('/refresh', LOGIN_REFRESH)
route.get('/search/user', HANDLE_SEARCH_HEADERS)

module.exports = route