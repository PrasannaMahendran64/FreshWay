const express = require('express')

const http = require('http')

const cors = require('cors')

const router = require("./Routers/Routes")

const path = require('path');


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(router)

const fileStore = express.static(path.join(__dirname,"Uploads"))

app.use("/files",fileStore)


app.get("/api", (req, res) => {
  res.json({ message: "Backend running on Vercel!" });
});


const server = http.createServer(app)



module.exports= server