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

    return chat;
}

export const fetchAllConversations = async (userId: string) => {
    return await Conversation.find({
        recipients: {
            $in: [userId]
        }
    })
    .populate({
        path: "recipients",
        select: "username id first_name last_name avatar email",
        options: { limit: 2 }
    })
    .sort({
        lastActivity: -1
    })
    .exec();
}

export const fetchConversationById = async (conversationId: string) => {
    return await Conversation.findById(conversationId)
        .populate("recipients", "username avatar first_name last_name avatar")
        .sort({
            lastActivity: -1
        })
        .exec();
}

export const fetchConversationChats = async (conversationId: string) => {
    return await Chat.find({
        conversation: conversationId
    })
    .populate("receiver", "username avatar first_name last_name avatar")
    .populate("sender", "username avatar first_name last_name avatar");
}

export const deleteConversationById = async(conversationId: string) => {
    await Conversation.find({
        _id: conversationId,
    });

    await Chat.deleteMany({
        conversation: conversationId,
    });
}

export const deleteChatById = async(chatId: string) => {
    await Chat.findOneAndDelete({
        _id: chatId
    })
}

export const markConversationChatsAsRead = async (conversationId: string, userId: string) => {
    await Chat.updateMany(
        {
            conversation: conversationId,
            sender: { $ne: userId },
            isRead: false
        },
        {
            isRead: true
        }
    );
}