"use strict";
const { Server } = require("socket.io");
const axios = require("axios");

module.exports = {
  register({ strapi }) {},

  bootstrap(/* { strapi } */) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });

    io.on("connection", function (socket) {
      socket.on("joinRoom", (room) => {
        console.log("user connected");
        console.log("Room is ", room);
        if (room) {
          socket.join(room);
          socket.emit("welcome", {
            user: "bot",
            text: `${room}, Welcome to the group chat`,
          });
        } else {
          console.log("An error occurred");
        }
      });

      socket.on("sendMessage", async (data) => {
        console.log(data);

     
          socket.broadcast.to(data.room).emit("message", {
            text: data.message,
            username: data.username,
            senderId: data.userId,
          });

      });
    });
  },
};
