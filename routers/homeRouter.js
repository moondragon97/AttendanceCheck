import express from "express";

const homeRouter = express.Router();

const homeHandle = (req, res) => res.send("This position is Homepage");

homeRouter.get("/", homeHandle);

export default homeRouter;