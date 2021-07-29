import express from "express";
import morgan from "morgan";

const PORT = 5000;
const app = express();

app.use(morgan('dev'));

const homeRouter = express.Router();

const homeHandle = (req, res) => res.send("This position is Homepage");

homeRouter.get("/", homeHandle);

const blogRouter = express.Router();

const blogHandle = (req, res) => res.send("Hi Blog");

blogRouter.get("/", blogHandle);

const bestblogHandle = (req, res) => res.send("This is best blog");

blogRouter.get("/best", bestblogHandle);

app.use("/", homeRouter);
app.use("/blog", blogRouter);

app.listen(PORT, console.log(`connect acces, PORT Num : ${PORT}`));