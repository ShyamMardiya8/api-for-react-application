const userInformation = require("../models/user")

const  GET_USER_INFORMATION = async (req, res) => {
    try{
        const userData = await userInformation.find({})
        return res.status(200).json(userData)
    }
    catch(err){
        console.log(err.message)
    }
}

const POST_USER_INFORMATION = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email } = req.body;

        if (!firstName || !lastName || !phoneNumber || !email) {
            return res.status(400).json({ message: "Sorry, you have missed some field(s)" });
        }

        const userData = new userInformation({
            firstName,
            lastName,
            phoneNumber,
            email
        });

        await userData.save();
        return res.status(201).json({ message: "User is created successfully" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const UPDATE_USER_INFORMATION = async (req, res) => {
    try{
        const {firstName, lastName, phoneNumber, email} = req.body
        const {id} = req.params
        if (!firstName || !lastName || !phoneNumber || !email) {
            return res.status(400).json({message : "Sorry you have missed some field"})
        }
        const userData = {
            firstName,
            lastName,
            phoneNumber,
            email
        }
        
        await userInformation.findByIdAndUpdate(id, userData)
        return res.status(201).json({message : "User is Updated"})
    }
    catch(err){
        console.log(err.message)
    }
}


const DELETE_USER_INFORMATION = async (req, res) => {
    try{
        const {id} = req.params
        await userInformation.findByIdAndDelete(id)
        return res.status(200).json({message : "User is deleted"})
    }
    catch(err){
        console.log(err.message)
    }
}
module.exports = {GET_USER_INFORMATION, POST_USER_INFORMATION, UPDATE_USER_INFORMATION, DELETE_USER_INFORMATION}