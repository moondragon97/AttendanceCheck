import express from "express";
import { getJoin, getLogin, logout, postJoin, postLogin } from "../Controllers/userController";

const rootRouter = express.Router();

const rootHandle = (req, res) => res.render("home", {titleName: "Home"});

rootRouter.get("/", rootHandle);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);

export default rootRouter;