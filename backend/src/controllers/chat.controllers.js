import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat, Message } from "../models/chat.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import { generateJWTToken_username } from "../utils/generateJWTtoken.js";

// Socket.IO instance
// Socket.IO instance is initialized in app.js and available globally

export const createChat = asyncHandler(async (req, res) => {
  console.log("\n******** Inside CreateChat *********\n");
  const { users } = req.body;
  const senderId = req.user._id;

  if (!users || users.length < 1) {
    throw new ApiError(400, "Please provide recipient user ID");
  }

  // Check if chat already exists
  const existingChat = await Chat.findOne({
    users: { $all: [senderId, ...users] }
  });

  if (existingChat) {
    return res.status(200).json(new ApiResponse(200, "Chat already exists", existingChat));
  }

  const chat = await Chat.create({
    users: [senderId, ...users]
  });

  if (!chat) {
    throw new ApiError(500, "Error creating chat");
  }

  res.status(200).json(new ApiResponse(200, "Chat created Successfully", chat));
});

export const getChats = asyncHandler(async (req, res) => {
  console.log("\n******** Inside getChats *********\n");
  const userId = req.user._id;

  const chats = await Chat.find({ users: userId })
    .populate('users')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });

  if (!chats) {
    throw new ApiError(500, "Error fetching chats");
  }

  res.status(200).json(new ApiResponse(200, "Chats fetched Successfully", chats));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const senderId = req.user._id;

  if (!content || !chatId) {
    throw new ApiError(400, "Content and chatId are required");
  }

  const message = await Message.create({
    content,
    sender: senderId,
    chat: chatId
  });

  if (!message) {
    throw new ApiError(500, "Error creating message");
  }

  // Update chat's latest message
  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: message._id
  });

  // Emit message to all users in the chat
  io.to(chatId).emit("message received", {
    sender: senderId,
    content,
    chat: chatId,
    createdAt: message.createdAt
  });

  res.status(200).json(new ApiResponse(200, "Message sent successfully", message));
});