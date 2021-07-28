import express from "express";
import morgan from "morgan";

const PORT = 5000;
const app = express();

const homeHandle = (req, res) => res.send("This position is Homepage");

app.use(morgan('dev'));
app.get("/", homeHandle);

app.listen(PORT, console.log(`connect acces, PORT Num : ${PORT}`));