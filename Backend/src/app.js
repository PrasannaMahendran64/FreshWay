const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDb } = require("./config/database");
const router = require("./Routers/Routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(["/health", "/api/health"], (req, res) => {
    res.status(200).json({ status: "ok", service: "Freshway API" });
});

const uploadsDir = path.join(__dirname, "Uploads");
const sendUploadFile = (req, res, next) => {
    const fileName = path.basename(req.params.file || "");
    res.sendFile(path.join(uploadsDir, fileName), (error) => {
        if (error) next();
    });
};

// Static uploads
app.get(["/api/files/:file", "/files/:file"], sendUploadFile);
app.use("/api/files", express.static(path.join(__dirname, "Uploads")));
app.use("/files", express.static(path.join(__dirname, "Uploads")));

app.use(async (req, res, next) => {
    try {
        await connectDb();
        next();
    } catch (error) {
        next(error);
    }
});

app.use("/api", router);
app.use(router);

const errorMiddleware = require("./MiddleWare/errorMiddleware");
app.use(errorMiddleware);

module.exports = app;
