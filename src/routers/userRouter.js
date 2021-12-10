import express from "express";
import {finishGithubLogin, getAttendance, logout, postAttendance, startGithubLogin, getProfile, getProfileEdit, postProfileEdit, getPasswordEdit, postPasswordEdit, leave, getAttendanceCheck, getAttendanceEachCheck, deleteAttendance, checkData, grantAdmin, grantManager, getManageFee, revokeManager } from "../Controllers/userController";
import { protectNotAdmin, protectNotManager, protectNotUser, protectSocialUser, uploadImage, s3AvatarRemove } from "../middlewares";

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
rootRouter.route("/:id/edit-profile").all(protectNotUser).get(getProfileEdit).post(uploadImage.single('avatar'), s3AvatarRemove, postProfileEdit); 
rootRouter.route("/:id/edit-password").all(protectNotUser, protectSocialUser).get(getPasswordEdit).post(postPasswordEdit);

rootRouter.post("/:id/leave", protectNotUser, leave);
rootRouter.post("/:id/grant-manager", protectNotUser, protectNotAdmin, grantManager);
rootRouter.post("/:id/revoke-manager", protectNotUser, protectNotAdmin, revokeManager);
rootRouter.post("/:id/grant-admin", protectNotUser, protectNotAdmin, grantAdmin);

export default rootRouter;