const mongoose = require("mongoose")


const loginAuth = new mongoose.Schema({
    userName : {
        type : String,
        require : true,
        trim : true
    },
    password : {
        type : String,
        require : true,
        trim : true
    }
})

const login = mongoose.model('loginAuth', loginAuth)

module.exports = login