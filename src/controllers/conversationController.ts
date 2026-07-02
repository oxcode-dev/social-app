import express from "express"
import { Conversation } from "../models/conversation.ts";
import { Chat } from "../models/chat.ts";
import { deleteConversationById, fetchAllConversations, fetchChatConversations, storeMessage } from "../services/conversationService.ts";

export const sendMessage = async (req: any, res: express.Response) => {
    const auth = req?.user;
    const { recipient, text } = req.body;

    if (!recipient || (!text.trim())) return;

    await storeMessage(auth.id, recipient, text);

    res.status(201).json({ msg: "Created." });
}

export const getConversations = async (req: any, res: express.Response) => {
    const auth = req?.user;

    const conversations = await fetchAllConversations(auth?._id);

    res.status(200).json({
        success: true,
        conversations
    });
}

export const deleteConversation = async (req: any, res: express.Response) => {
    const auth = req?.user;
    const conversationId = req.params.conversationId as string;

    await deleteConversationById(conversationId);


    res.status(200).json({
        success: true,
        message: "Conversation deleted successfully",
    });
}

export const getChatConversations = async (req: any, res: express.Response) => {

    const messages = await fetchChatConversations(req.params.chatId);

    res.status(200).json({
        success: true,
        messages,
    });
}
