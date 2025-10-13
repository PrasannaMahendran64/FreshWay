const mongoose = require('mongoose')
const server = require("./app")
require('dotenv').config()

const mongodb_url = process.env.MONGODB_URL

const port = process.env.PORT

mongoose.connect(mongodb_url).then(() => {
    server.listen(port, () => {
        console.log(`server is running on ${port}`)
    })
    console.log("mongodb connected")
}).catch((err) => {
    console.log("mongodb error", err)
})