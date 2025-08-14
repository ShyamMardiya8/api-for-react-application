const jwt = require("jsonwebtoken");
const asyncHandler = require("../util/asyncHandler");
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
const ApiError = require("../utility/ApiError");
const admin = require("../models/admin.model");
const validator = require("../validators/Field");
const ApiResponse = require("../utility/ApiResponse");
dotenv.config()

const HANDLE_SIGNUP = asyncHandler (async (req, res) => {
    const {email, password} = req.body
    const hashedPassword = bcrypt.hash(password, 10);
    const mergedData ={email, password}
    const {isValid, missingFields} = validator(mergedData)
    const missingFieldsError = missingFields.join(', ')
    console.info("🚀 ~ missingFields:", missingFields)
    if (!isValid) {
        throw new ApiError(400, `fill this field ${missingFieldsError}`)
    }

    const adminData = new admin({
        email,
        hashedPassword
    })

    const createdAdmin = await adminData.save()
    const generateToken = jwt.sign({id : createdAdmin?._id}, process.env.SECRET_KEY, {
        expiresIn : "1h"
    })

    const refreshToken = jwt.sign({id : createdAdmin?._id}, process.env.SECRET_KEY, {
        expiresIn : "7d"
    })

    return res.status(201).json(new ApiResponse(201, "admin created", {generateToken, refreshToken}))

})


module.exports = {
    HANDLE_SIGNUP
}