import express from "express";
import { join } from "../Controllers/userController";

const rootRouter = express.Router();

const rootHandle = (req, res) => res.render("home");

rootRouter.get("/", rootHandle);
rootRouter.get("/join", join);

export default rootRouter;