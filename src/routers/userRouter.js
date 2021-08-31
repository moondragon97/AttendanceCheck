import express from "express";
import {finishGithubLogin, getAttendance, logout, postAttendance, startGithubLogin, getProfile, getProfileEdit, postProfileEdit, getPasswordEdit, postPasswordEdit } from "../Controllers/userController";
import { protectNotUser } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/logout", logout);
rootRouter.route("/attendance").all(protectNotUser).get(getAttendance).post(postAttendance);
rootRouter.get("/github/start", startGithubLogin);
rootRouter.get("/github/finish", finishGithubLogin);
rootRouter.route("/edit-profile").all(protectNotUser).get(getProfileEdit).post(postProfileEdit); 
rootRouter.route("/edit-password").all(protectNotUser).get(getPasswordEdit).post(postPasswordEdit);
rootRouter.get("/:id", protectNotUser, getProfile);

export default rootRouter;