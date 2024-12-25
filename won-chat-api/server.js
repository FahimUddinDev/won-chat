const express = require("express");
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const User = require("./models/userModel");

connectDB();
const port = process.env.PORT || 5000;

const server = app.listen(3002, console.log(`Started port ${port}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  const userId = socket?.handshake?.query?.userId;
  // connect with socketio
  socket.join("activeRoom");
  socket.on("setup", (userData) => {
    socket.join(userData);
    socket.emit("connected");
    User.findByIdAndUpdate(userData, { isActive: true })
      .then((data) => {
        socket.in("activeRoom").emit("active user", userData);
      })
      .catch((err) => console.error("Error updating user status:", err));
  });

  // chat room join
  socket.on("join chat", (roomId) => {
    socket.join(roomId);
  });
  // new massage handle
  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return;
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received socket", newMessageReceived);
    });
  });
  //   typing
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // user inactive handle
  if (userId) {
    socket.on("disconnect", () => {
      User.findByIdAndUpdate(userId, { isActive: false })
        .then(() => {
          socket.in("activeRoom").emit("inactive user", userId);
          socket.leave("activeRoom");
        })
        .catch((err) => console.error("Error updating user status:", err));
    });
  }
  socket.off("setup", () => {
    socket.leave(userId);
  });
});
