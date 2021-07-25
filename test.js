import express from "express";
const PORT = 5000;
const app = express();

const home = (req, res, next) => next();

const homesecond = (req, res) => res.send("Hi!!");

app.get("/", home, homesecond)

app.listen(PORT, console.log(`connect acces, PORT Num : ${PORT}`));