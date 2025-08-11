const bcrypt = require("bcrypt");
const login = require("../models/login.model");
const jwt = require("jsonwebtoken");
const validator = require("../validators/Field");
const dotenv = require("dotenv")
dotenv.config()

const USER_REGISTER = async (req, res) => {
    const { userName, password } = req.body;
    const mergedData = { userName, password };

    const {isValid, missingFields} = validator(mergedData);
    if (!isValid) {
        return res.status(400).json({message : `missing Field is ${missingFields.join(', ')}`})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userLogin = new login({ userName: userName, password: hashedPassword });
    await userLogin.save();

    return res.status(200).json({ message: "user is created" });
};

const LOGIN_USER = async (req, res) => { 
    try{
        const {userName, password} = req.body
        const mergedData = {userName, password}

        const {isValid, missingFields} = validator(mergedData)

        if (!isValid) {
            return res.status(400).json({message : `missing field ${missingFields.join(", ")}`})    
        }

        const findUser = await login.findOne({userName})

        const checkPassword = await bcrypt.compare(password, findUser.password) 

        const token = jwt.sign({userId : findUser._id}, process.env.SECRET_KEY, {
            expiresIn : '1h'
        })

        const refreshToken = jwt.sign({userId : findUser._id}, process.env.SECRET_KEY, {
            expiresIn : '30d'
        })

        return res.status(200).json({token, refreshToken})
    }
    catch(err) {
        console.log(err.message)
    }
};

const LOGIN_REFRESH = async (req, res) => {
    try{
        const authHeader = req.header['authorization']
        if (!authHeader) {
            return res.status(400).json({message : "refresh token is missing"})
        }
        jwt.verify(authHeader, process.env.SECRET_KEY, (err, decode) =>{
            if (err) {
                return res.status(406).json({message : "Unauthorized"})
            }

            const userId = decode.userId

            const newAccessToken = jwt.sign({userId : userId}, process.env.SECRET_KEY, {
                expiresIn : "1h"
            })

            const newRefreshToken = jwt.sign({userId : userId}, process.env.SECRET_KEY, {
                expiresIn : "30d"
            })
            
            return res.status(200).json({newAccessToken, newRefreshToken})
        }
    )
    }
    catch(err){
        console.log(err.message)
        return res.status(400).message({message : "something wrong"})
    }
}
module.exports = {
    USER_REGISTER,
    LOGIN_USER,
    LOGIN_REFRESH
};
