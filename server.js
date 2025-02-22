const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser")
require("dotenv").config();
require("./Models/db");
const bodyParser = require("body-parser");
const AuthRouter = require("./Routes/AuthRouter");
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Test route to check if server is running
app.post("/", (req, res) => {
  res.send("Server is running");
});




app.use("/auth", AuthRouter);
app.use("/category",AuthRouter)
app.use("/request",AuthRouter)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
