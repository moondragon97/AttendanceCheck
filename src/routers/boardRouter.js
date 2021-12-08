import express from "express";
import {board, getEdit, getEnroll, postEdit, postEnroll, read, remove, search } from "../Controllers/boardController";
import { protectNotUser } from "../middlewares";

const rootRouter = express.Router();

rootRouter.route("/").get(board).post(search);
rootRouter.route("/enroll").all(protectNotUser).get(getEnroll).post(postEnroll);
rootRouter.get("/:id", read);
rootRouter.route("/:id/edit").all(protectNotUser).get(getEdit).post(postEdit);
rootRouter.get("/:id/remove", protectNotUser, remove);

export default rootRouter;