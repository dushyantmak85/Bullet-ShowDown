const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
  console.log("New player connected:", socket.id);

  if (Object.keys(players).length < 2) {
    players[socket.id] = {
      x: Math.random() * 500,
      y: Math.random() * 500,
      angle: 0,
      bullets: [],
      health: 100,
    };
  } else {
    socket.emit("full");
    socket.disconnect();
    return;
  }

  socket.on("update", (data) => {
    if (players[socket.id]) {
      players[socket.id] = { ...players[socket.id], ...data };
      io.emit("state", players);
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    delete players[socket.id];
    io.emit("state", players);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
