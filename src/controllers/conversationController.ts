import express from "express"
import { Conversation } from "../models/conversation.ts";
import { Chat } from "../models/chat.ts";
import { fetchChatConversations, storeMessage } from "../services/conversationService.ts";

export const sendMessage = async (req: any, res: express.Response) => {
    const auth = req?.user;
    const { recipient, text } = req.body;

    if (!recipient || (!text.trim())) return;

    await storeMessage(auth.id, recipient, text);

    res.status(201).json({ msg: "Created." });
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

    const messages = await fetchChatConversations(req.params.chatId);

    res.status(200).json({
        success: true,
        messages,
    });
}