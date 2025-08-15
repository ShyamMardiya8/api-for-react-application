const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "access denied " });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log(req.userId, "userId");
    console.log(decode.userId, "userId");
    req.userId = decode.userId;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
