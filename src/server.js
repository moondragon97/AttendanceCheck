import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";

const PORT = 5000;
const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views")
app.use(morgan('dev'));
app.use("/", rootRouter);

app.listen(PORT, console.log(`connect acces, PORT Num : ${PORT}`));