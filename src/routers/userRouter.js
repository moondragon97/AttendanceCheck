import express from "express";
import {finishGithubLogin, getAttendance, logout, postAttendance, startGithubLogin, getProfile, getProfileEdit, postProfileEdit, getPasswordEdit, postPasswordEdit, leave, getAttendanceCheck, getAttendanceEachCheck, deleteAttendance, checkData, grantAdmin, grantManager, getManageFee } from "../Controllers/userController";
import { protectNotAdmin, protectNotManager, protectNotUser, protectSocialUser, uploadImage } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/check-data", protectNotUser, checkData);
rootRouter.get("/manage-fee", protectNotUser, protectNotManager, getManageFee);
rootRouter.get("/logout", protectNotUser, logout);
rootRouter.route("/attendance").all(protectNotUser).get(getAttendance).post(postAttendance);
rootRouter.get("/attendance/check", protectNotUser, getAttendanceCheck);
rootRouter.get("/attendance/check/:id/delete", protectNotUser, protectNotAdmin, deleteAttendance);
rootRouter.get("/attendance/:id", protectNotUser, getAttendanceEachCheck);
rootRouter.get("/github/start", startGithubLogin);
rootRouter.get("/github/finish", finishGithubLogin);
rootRouter.get("/:id", protectNotUser, getProfile);
rootRouter.route("/:id/edit-profile").all(protectNotUser).get(getProfileEdit).post(uploadImage.single('avatar'), postProfileEdit); 
rootRouter.route("/:id/edit-password").all(protectNotUser, protectSocialUser).get(getPasswordEdit).post(postPasswordEdit);
rootRouter.get("/:id/leave", protectNotUser, leave);

rootRouter.get("/:id/grant-manager", protectNotUser, protectNotAdmin, grantManager);
rootRouter.get("/:id/grant-admin", protectNotUser, protectNotAdmin, grantAdmin);

export default rootRouter;