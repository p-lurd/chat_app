const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  // console.log("New user connected", socket.id);
  // const phone_number = socket.handshake.headers.phone_number;
  // console.log("Header phone_number", socket.handshake.headers.phone_number);
  // phone_number;
  // const username = socket.handshake.headers.username;
  // const groupId = socket.handshake.headers.groupId;
  // console.log(groupId)
  // socket.to(groupId).emit("chatMessage", username + " joined our chat room");
  socket.on('joinChat', ({username, phone, groupId}) => {
    socket.join(groupId);
    io.to(groupId).emit('chatMessage', `${username} joined the chat.`);
  });


  socket.on("newMessage", (data, groupId, username) => {
    console.log("newMessage", `${username}: ${data}`);
    io.to(groupId).emit("chatMessage", `${username}: ${data}`);
  });

  // socket.on('typing', (username, phone, groupId) => {
  //   console.log(groupId);
  //   socket.to(groupId).emit("typing", `${username} is typing`);
  // });

  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
