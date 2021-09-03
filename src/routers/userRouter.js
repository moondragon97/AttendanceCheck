import express from "express";
import {finishGithubLogin, getAttendance, logout, postAttendance, startGithubLogin, getProfile, getProfileEdit, postProfileEdit, getPasswordEdit, postPasswordEdit, leave } from "../Controllers/userController";
import { protectNotUser, protectSocialUser, uploadFiles } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/logout", logout);
rootRouter.route("/attendance").all(protectNotUser).get(getAttendance).post(postAttendance);
rootRouter.get("/github/start", startGithubLogin);
rootRouter.get("/github/finish", finishGithubLogin);
rootRouter.get("/:id", protectNotUser, getProfile);
rootRouter.route("/:id/edit-profile").all(protectNotUser).get(getProfileEdit).post(uploadFiles.single('avatar'), postProfileEdit); 
rootRouter.route("/:id/edit-password").all(protectNotUser, protectSocialUser).get(getPasswordEdit).post(postPasswordEdit);
rootRouter.get("/:id/leave", protectNotUser, leave);

export default rootRouter;