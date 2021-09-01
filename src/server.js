import session from "express-session";
import express from "express";
import morgan from "morgan";
import mongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// session 미들웨어를 만듦으로써 브라우저에게 session 텍스트를 부여한다.
app.use(session({
    secret: "Secret!",     // 암호화를 위한 것이다. 우선 아무 string값을 넣는다.
    resave: false,          // 변화가 있든 없든 세션을 매번 저장할지(갱실할지).
    saveUninitialized: false,  // 아무 변화 없는 새로운 session을 계속 저장할지(쌓을지).
    cookie:{
        maxAge: 20000000,
    },
    store: mongoStore.create({mongoUrl: process.env.DB_URL}),
}))

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/", rootRouter);
app.use("/user", userRouter);

export default app;