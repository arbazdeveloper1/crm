import { Server } from "socket.io";
import { query } from "../config/db.js";

const SetupServer = async (server) => {
  try {
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    let users = {}
    io.on("connection", (socket) => {

        socket.on("registerUser", (userId) => {
            users[userId] = socket.id; 
            io.emit("updateOnlineUsers", Object.keys(users));
        });
    

      socket.on("message", async(data) => {
        const { sender_id, receiver_id, message, file } = data;
        const receiverSocketId = users[receiver_id];

        const fileUrl = file || null;

        const sql = "INSERT INTO messages (sender, receiver, message, attachement) VALUES (?, ?, ?, ?)";
        try {
          await query(sql, [sender_id, receiver_id, message || null, fileUrl]);  // Ensure message can be null
          console.log('Message saved successfully in DB');
        } catch (error) {
          console.error('Error inserting into database:', error);
        }

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", data);
        }

      });

      socket.on("disconnect", () => {
        let disconnectedUserId = null;
        for (let userId in users) {
            if (users[userId] === socket.id) {
                disconnectedUserId = userId;
                delete users[userId];
                break;
            }
        }
        if (disconnectedUserId) {
            io.emit("updateOnlineUsers", Object.keys(users)); 
          }
    });
    });
    return io;
  } catch (error) {
    console.log(error);
  }
};


export default SetupServer
