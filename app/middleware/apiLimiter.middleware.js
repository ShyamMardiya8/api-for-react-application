const rateLimit = require("express-rate-limit")

const appLimiter = rateLimit({
    windowMs: 2 * 1000, // 2 seconds
    max : 1, // Limit each ip to 1 request per windowsMs
    message : {
        status : 429,
        error : "Too many requests please wait before trying again"
    },
    standardHeaders : true, // Return rate limit info in headers
    legacyHeaders : false // Disable the X-RateLimit headers
})

module.exports = appLimiter