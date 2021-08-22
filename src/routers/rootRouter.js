import express from "express";
import { getJoin, postJoin } from "../Controllers/userController";

const rootRouter = express.Router();

const rootHandle = (req, res) => res.render("home", {titleName: "Home"});

rootRouter.get("/", rootHandle);
rootRouter.route("/join").get(getJoin).post(postJoin);

export default rootRouter;