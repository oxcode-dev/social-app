import express from "express"
import {
    deleteConversationById, fetchAllConversations, fetchConversationChats, fetchConversationById, storeMessage 
} from "../services/conversationService.ts";

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
