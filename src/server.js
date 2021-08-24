import session from "express-session";
import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import { localsMiddleware } from "./middlewares";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "Secret!",
    resave: true,
    saveUninitialize: true,
    cookie:{
        maxAge: 2000000,
    }
}))

app.use(localsMiddleware);
app.use("/", rootRouter);

export default app;