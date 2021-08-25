import express from "express";
import {getAttendance, logout } from "../Controllers/userController";

const rootRouter = express.Router();

rootRouter.get("/logout", logout);
rootRouter.get("/attendance", getAttendance);

export default rootRouter;