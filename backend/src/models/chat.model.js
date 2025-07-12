import mongoose, { Schema } from "mongoose";

// Chat Schema
const chatSchema = new Schema({
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    latestMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },
}, {
    timestamps: true
});

// Message Schema
const messageSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
}, {
    timestamps: true
});

export const Chat = mongoose.model("Chat", chatSchema);
export const Message = mongoose.model("Message", messageSchema);