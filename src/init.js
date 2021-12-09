import "regenerator-runtime"
import "dotenv/config";
import "./db";
import app from "./server";

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`✅Connection Successful, PORT Num : ${PORT}`));