import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  let users = [];

  const addNewUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
      users.push({ userId, socketId });
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  io.on("connection", (socket) => {
    console.log("New User Connected");

    // Setup user
    socket.on("setup", (userId) => {
      addNewUser(userId, socket.id);
      socket.emit("connected");
    });

    // Handle message sending
    socket.on("send message", async (data) => {
      const { chatId, senderId, content, type } = data;
      
      // Emit message to all users in the chat
      io.to(chatId).emit("message received", {
        sender: senderId,
        content,
        chat: chatId,
        type
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User Disconnected");
      removeUser(socket.id);
    });
  });

  return io;
};

export default io;
