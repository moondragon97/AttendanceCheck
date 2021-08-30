import express from "express";
import {finishGithubLogin, getAttendance, logout, postAttendance, startGithubLogin } from "../Controllers/userController";
import { protectNotUser } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/logout", logout);
rootRouter.route("/attendance").all(protectNotUser).get(getAttendance).post(postAttendance);
rootRouter.get("/github/start", startGithubLogin);
rootRouter.get("/github/finish", finishGithubLogin);

export default rootRouter;