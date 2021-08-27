import express from "express";
import {getAttendance, logout, postAttendance } from "../Controllers/userController";
import { protectNotUser } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/logout", logout);
rootRouter.route("/attendance").all(protectNotUser).get(getAttendance).post(postAttendance);

export default rootRouter;