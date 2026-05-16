import mongoose, { Schema } from "mongoose";

export interface IConversation {
  _id: string;
  sender: mongoose.Schema.Types.ObjectId;
  receiver: mongoose.Schema.Types.ObjectId;
  chatId: string | mongoose.Schema.Types.ObjectId;
  content: string;
}

const conversationSchema = new Schema<IConversation>({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "social_user"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "social_user"
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "social_chats"
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
}, { timestamps: true });

conversationSchema.set('toObject', { virtuals: true });
conversationSchema.set('toJSON', { virtuals: true });

export const Conversation = mongoose.model('social_conversations', conversationSchema);