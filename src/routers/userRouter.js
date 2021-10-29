import express from "express";
import {finishGithubLogin, getAttendance, logout, postAttendance, startGithubLogin, getProfile, getProfileEdit, postProfileEdit, getPasswordEdit, postPasswordEdit, leave, getAttendanceCheck, getAttendanceEachCheck, deleteAttendance, checkData, grantAdmin } from "../Controllers/userController";
import { protectNotAdmin, protectNotUser, protectSocialUser, uploadFiles } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/check-data", protectNotUser, protectNotAdmin, checkData);
rootRouter.get("/logout", protectNotUser, logout);
rootRouter.route("/attendance").all(protectNotUser).get(getAttendance).post(postAttendance);
rootRouter.get("/attendance/check", protectNotUser, getAttendanceCheck);
rootRouter.get("/attendance/check/:id/delete", protectNotUser, protectNotAdmin, deleteAttendance);
rootRouter.get("/attendance/:id", protectNotUser, getAttendanceEachCheck);
rootRouter.get("/github/start", startGithubLogin);
rootRouter.get("/github/finish", finishGithubLogin);
rootRouter.get("/:id", protectNotUser, getProfile);
rootRouter.route("/:id/edit-profile").all(protectNotUser).get(getProfileEdit).post(uploadFiles.single('avatar'), postProfileEdit); 
rootRouter.route("/:id/edit-password").all(protectNotUser, protectSocialUser).get(getPasswordEdit).post(postPasswordEdit);
rootRouter.get("/:id/leave", protectNotUser, leave);
rootRouter.get("/:id/grant-admin", protectNotUser, protectNotAdmin, grantAdmin);

export default rootRouter;