import express from "express";
import { getJoin, getLogin, logout, postJoin, postLogin } from "../Controllers/userController";
import { protectUser } from "../middlewares";

const rootRouter = express.Router();

const rootHandle = (req, res) => res.render("home", {titleName: "Home"});

rootRouter.get("/", rootHandle);
rootRouter.route("/join").all(protectUser).get(getJoin).post(postJoin);
rootRouter.route("/login").all(protectUser).get(getLogin).post(postLogin);

export default rootRouter;