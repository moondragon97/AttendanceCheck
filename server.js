import express from "express";
import morgan from "morgan";
import homeRouter from "./routers/homeRouter";

const PORT = 5000;
const app = express();

app.use(morgan('dev'));

app.use("/", homeRouter);

app.listen(PORT, console.log(`connect acces, PORT Num : ${PORT}`));