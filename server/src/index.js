// "use strict";
// const { Server } = require("socket.io");
// const axios = require("axios");

// module.exports = {
//   /**
//    * An asynchronous register function that runs before
//    * your application is initialized.
//    *
//    * This gives you an opportunity to extend code.
//    */
//   register({ strapi }) {},
//   /**
//    * An asynchronous bootstrap function that runs before
//    * your application gets started.
//    *
//    * This gives you an opportunity to set up your data model,
//    * run jobs, or perform some special logic.
//    */
//   bootstrap(/* { strapi } */) {
//     // strapi.server.httpServer is the new update for Strapi V4
//     const io = new Server(strapi.server.httpServer, {
//       cors: {
//         // CORS setup
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["my-custom-header"],
//         credentials: true,
//       },
//     });

//     io.on("connection", function (socket) {
//       // Listening for a connection from the frontend
//       socket.on("joinRoom", room => {
//         // Listening for a join connection
//         console.log("user connected");
//         console.log("username is ", room);
//         if (room) {
//           socket.join(room); // Adding the user to the group
//           socket.emit("welcome", {
//             // Sending a welcome message to the User
//             user: "bot",
//             text: `${room}, Welcome to the group chat`,
//           });
//         } else {
//           console.log("An error occurred");
//         }
//       });

//       socket.on("sendMessage", async (data) => {

//         console.log(data)
//         // Listening for a sendMessage connection
//         // let strapiData = {
//         //   // Generating the message data to be stored in Strapi
//         //   data: {
//         //     user: data.user,
//         //     message: data.message,
//         //   },
//         // };

//         socket.broadcast.to(data.room).emit("message", {
//           // Sending the message to the group
//           // user: data.username,
//           text: data.message,
//         });

//         // try {
//         //   await axios.post("http://localhost:1337/api/messages", strapiData); // Storing the messages in Strapi
//         //   socket.broadcast.to("group").emit("message", {
//         //     // Sending the message to the group
//         //     user: data.username,
//         //     text: data.message,
//         //   });
//         // } catch (e) {
//         //   console.log("error", e.message);
//         // }
//       });
//     });
//   },
// };






"use strict";
const { Server } = require("socket.io");

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
        });

        // Uncomment the following lines if you need to store messages in Strapi
        // try {
        //   let strapiData = {
        //     data: {
        //       user: data.user,
        //       message: data.message,
        //     },
        //   };
        //   await axios.post("http://localhost:1337/api/messages", strapiData);
        // } catch (e) {
        //   console.log("error", e.message);
        // }
      });
    });
  },
};

