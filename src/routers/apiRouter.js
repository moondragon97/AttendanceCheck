import express from "express";
import { manageFee } from "../Controllers/userController";
import { protectNotManager } from "../middlewares";

const apiRouter = express.Router();

apiRouter.route("/fee/:id([0-9a-f]{24})/manageFee").get(protectNotManager).post(manageFee);

export default apiRouter;