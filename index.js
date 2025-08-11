const express = require("express")
const connectDb = require("./app/connections/db")
const router = require("./app/routes/route")
const app = express()

connectDb()

app.use(express.json());

app.use('/api', router)

app.listen(3000, () => {
    console.log(`server is started on 3000 https://192.168.29.185/api`)
})

