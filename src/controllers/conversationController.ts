import express from "express"
import { Conversation } from "../models/conversation.ts";
import { Chat } from "../models/chat.ts";

export const sendMessage = async (req: any, res: express.Response) => {
    const auth = req?.user;
    const { recipient, text } = req.body;

    if (!recipient || (!text.trim())) return;

    const newChat = await Chat.findOneAndUpdate(
        {
            $or: [
                { recipients: [auth?.id, recipient] },
                { recipients: [recipient, auth.id] },
            ],
        },
        {
            recipients: [auth?.id, recipient],
            latestMessage: text,
        },
        { new: true, upsert: true }
    );

    const conversation = new Conversation({
        chatId: newChat._id,
        sender: auth?.id,
        receiver: recipient,
        content: text,
    });

    await conversation.save();

    res.json({ msg: "Created." });
}

export const getChats = async (req: any, res: express.Response) => {
    const chats = await Chat.find({
        recipients: {
            $in: [req.user._id]
        }
    }).sort({ updatedAt: -1 }).populate("recipients latestMessage");

    res.status(200).json({
        success: true,
        chats
    });
}

export const deleteChats = async (req: any, res: express.Response) => {
    const auth = req?.user;
    const chat_id = req.params.chatId

    // const chats = await Chat.findOneAndDelete({
    const chats = await Chat.find({
        _id: chat_id,
    });

    const conversations = await Conversation.deleteMany({
        chatId: chat_id,
    });


    res.status(200).json({
        success: true,
        chats,
        conversations,
    });
}

export const getChatConversations = async (req: any, res: express.Response) => {
    const messages = await Conversation.find({
        chatId: req.params.chatId
    }).populate("receiver sender");

    res.status(200).json({
        success: true,
        messages,
    });
}