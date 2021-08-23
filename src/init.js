import "./db";
import app from "./server";

const PORT = 5000;

app.listen(PORT, console.log(`✅Connection Successful, PORT Num : ${PORT}`));