const express = require('express');
const cors = require('cors');
const router = require("./Routers/Routes");
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

// Static uploads
const fileStore = express.static(path.join(__dirname, "Uploads"));
app.use("/files", fileStore);

module.exports = app;  
