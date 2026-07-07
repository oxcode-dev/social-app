import express from "express"
import {
    deleteConversationById, fetchAllConversations, fetchConversationChats, fetchConversationById, storeMessage, 
    deleteChatById,
    markConversationChatsAsRead
} from "../services/conversationService.ts";
import { createNotification } from "../services/notificationService.ts";

export const sendMessage = async (req: any, res: express.Response) => {
    const auth = req?.user;
    const { recipient, text } = req.body;

    if (!recipient || (!text.trim())) return;

    const chat = await storeMessage(auth.id, recipient, text);

    await createNotification({
        io: req.app.get("io"),
        //@ts-ignore
        recipient: recipient,
        sender: auth.id, 
        type: "CHAT",
        post: null,
        chat: chat._id,
        comment: null,
        message: `${auth.username} sent you a chat.`
    });

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

export const getConversationById = async (req: express.Request, res: express.Response) => {
    const conversationId = req.params.conversationId as string;

    const conversation = await fetchConversationById(conversationId);

    if (!conversation) {
        return res.status(404).send({
            message: "Conversation not found!",
        })
    }

    let data = {
        conversation,
        recipients: conversation.recipients,
        status: "success",
        message: "Conversation fetched successfully!!!",
    }

    res.status(200).json(data);
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

export const getConversationChats = async (req: any, res: express.Response) => {

    const messages = await fetchConversationChats(req.params.conversationId);

    res.status(200).json({
        success: true,
        messages,
        message: "Conversation chats fetched successfully"
    });
}

export const deleteChat = async (req: express.Request, res: express.Response) => {
    const chatId = req.params.chatId as string;

    await deleteChatById(chatId);

    res.status(200).json({
        success: true,
        message: "Chats deleted successfully"
    });
}

export const markAsRead = async (req: express.Request | any, res: express.Response) => {
    const conversationId = req.params.conversationId as string;
    const auth = req?.user;

    await markConversationChatsAsRead(conversationId, auth.id);

    res.json({
        success: true,
        message: "Chats marked as read successfully"
    });
    
}

export const readChat = async (req: express.Request, res: express.Response) => {

}
