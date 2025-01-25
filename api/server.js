const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io"); // Correct import
require("dotenv").config();
require("./Models/db");
const bodyParser = require("body-parser");
const AuthRouter = require("./Models/Routes/AuthRouter");
const productRouter = require("./Models/Routes/productRouter");
const messageRoutes = require("./Models/Routes/messages");
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
  },
});

app.use(bodyParser.json());
app.use(cors());

app.post("/", (req, res) => {
  res.send("Server");
});

app.use("/auth", AuthRouter);
app.use("/products", productRouter);
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
