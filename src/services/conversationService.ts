import { Chat } from "../models/chat.ts";
import { Conversation } from "../models/conversation.ts";

export const storeMessage = async (userId: string, recipientId: string, text: string) => {
    const conversation = await Conversation.findOneAndUpdate(
        {
            $or: [
                { recipients: [userId, recipientId] },
                { recipients: [recipientId, userId] },
            ],
        },
        {
            recipients: [userId, recipientId],
            latestMessage: text,
            lastActivity: new Date()
        },
        { new: true, upsert: true }
    );

    const chat = new Chat({
        conversation: conversation._id,
        sender: userId,
        receiver: recipientId,
        content: text,
    });

    await chat.save();
}

export const fetchAllConversations = async (userId: string) => {
    return await Conversation.find({
        recipients: {
            $in: [userId]
        }
    })
    .populate({
        path: "recipients",
        select: "username id first_name last_name email",
    })
    .sort({
        lastActivity: -1
    })
    .exec();
}

export const fetchConversationById = async (conversationId: string) => {
    return await Conversation.findById(conversationId)
        .populate("recipients", "username avatar first_name last_name")
        // .populate("recipients")
        .sort({
            lastActivity: -1
        })
        .exec();
}

export const fetchChatConversations = async (chatId: string) => {
    return await Conversation.find({
        chatId: chatId
    }).populate("receiver sender");
}

export const deleteConversationById = async(conversationId: string) => {
    await Conversation.find({
        _id: conversationId,
    });

    await Chat.deleteMany({
        conversation: conversationId,
    });
}