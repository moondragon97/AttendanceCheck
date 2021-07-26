import express from "express";
const PORT = 5000;
const app = express();

const home = (req, res, next) => {
    console.log("home");
    next();
}
const homesecond = (req, res, next) => {
    console.log("homesecond");
    next();
}

const homeHandle = (req, res) => res.send("This position is Homepage");
const testHandle = (req, res) => res.send("This position is Testpage");

app.use(home, homesecond);
app.get("/", homeHandle);
app.get("/test", testHandle);

app.listen(PORT, console.log(`connect acces, PORT Num : ${PORT}`));