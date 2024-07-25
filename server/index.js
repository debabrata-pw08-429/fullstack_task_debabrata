require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { addTask } = require("./controllers/taskController");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use(cors());
app.use(taskRoutes);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("add", async (task) => {
    await addTask(task);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
