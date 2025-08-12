const userInformation = require("../models/user")
const ApiError = require("../utility/ApiError")

const  GET_USER_INFORMATION = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const results = {}

    const startIndex = (page - 1) * limit
    console.log(startIndex, "start index")
    const endIndex = page * limit

    try{
        const totalCount = await userInformation.countDocuments().exec()

        if (endIndex < totalCount) {
            results.next = {
                page : page + 1,
                limit : limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page : page - 1,
                limit : limit
            }    
        }

        results.userInformation = await userInformation.find().limit(limit).skip(startIndex).exec()
        return res.status(200).json(results)
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json({message : "Something wrong"})
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
          return res.status(500).json({message : "Something wrong"})
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
        return res.status(500).json({message : "Something wrong"})
    }
}

const HANDLE_SEARCH_HEADERS = async (req, res) => {  
        const {name, email} = req.query
        if ((!name || name.trim() === "") && (!email || email.trim() === "")) {
            throw new ApiError(400, "Search Term is required");
        }

        const users = await userInformation.find({
            $or: [
                    {firstName : {$regex : name, $options : "i"}},
                    {email : {$regex : email, $options : "i"}}
            ]
        })

        return res.status(202).json(users)
    
}

module.exports = {GET_USER_INFORMATION, POST_USER_INFORMATION, UPDATE_USER_INFORMATION, DELETE_USER_INFORMATION, HANDLE_SEARCH_HEADERS}