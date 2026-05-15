import { Chat } from "../models/chat.ts";
import { Conversation } from "../models/conversation.ts";

export const storeMessage = async (userId: string, recipientId: string, text: string) => {
    const newChat = await Chat.findOneAndUpdate(
        {
            $or: [
                { recipients: [userId, recipientId] },
                { recipients: [recipientId, userId] },
            ],
        },
        {
            recipients: [userId, recipientId],
            latestMessage: text,
        },
        { new: true, upsert: true }
    );

    const conversation = new Conversation({
        chatId: newChat._id,
        sender: userId,
        receiver: recipientId,
        content: text,
    });

    await conversation.save();
}