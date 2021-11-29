import express from "express";
import { manageFee } from "../Controllers/userController";
const apiRouter = express.Router();

apiRouter.post("/fee/:id([0-9a-f]{24})/manageFee", manageFee);

export default apiRouter;