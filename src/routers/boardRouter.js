import express from "express";
import {board, getEdit, getEnroll, postEdit, postEnroll, read, remove, search } from "../controllers/boardController";
import { protectNotUser, protectSocialUser } from "../middlewares";

const boardRouter = express.Router();

boardRouter.route("/").get(board).post(search);
boardRouter.route("/enroll").all(protectNotUser).get(getEnroll).post(postEnroll);
boardRouter.get("/:id", read);
boardRouter.route("/:id/edit").all(protectNotUser).get(getEdit).post(postEdit);
boardRouter.get("/:id/remove", protectNotUser, remove);
export default boardRouter;