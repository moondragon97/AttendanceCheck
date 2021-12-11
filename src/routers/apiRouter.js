import express from "express";
import { manageFee, updateTotalFee } from "../Controllers/userController";
import { protectNotManager } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/fee/:id([0-9a-f]{24})/manageFee", protectNotManager, manageFee);
apiRouter.post("/fee/updateTotalFee", protectNotManager, updateTotalFee)
export default apiRouter;