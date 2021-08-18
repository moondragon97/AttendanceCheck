import express from "express";

const homeRouter = express.Router();

const homeHandle = (req, res) => res.render("home");

homeRouter.get("/", homeHandle);

export default homeRouter;