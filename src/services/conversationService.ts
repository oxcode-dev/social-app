import { Chat } from "../models/chat.ts";
import { Conversation } from "../models/conversation.ts";

export const storeMessage = async (userId: string, recipientId: string, text: string) => {
    // return console.log(userId, recipientId, text)
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
        conversationId: conversation._id,
        sender: userId,
        receiver: recipientId,
        content: text,
    });

    await chat.save();
}

export const fetchAllConversations = async (userId: string) => {
    return await Conversation.find({
        // participants: req.user.id
        recipients: {
            $in: [userId]
        }
    })
    .populate("recipients", "username profilePic")
    .populate("latestMessage")
    .sort({
        lastActivity: -1
    });
}

export const fetchChatConversations = async (chatId: string) => {
    return await Conversation.find({
        chatId: chatId
    }).populate("receiver sender");
}
