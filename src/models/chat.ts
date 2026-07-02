import mongoose, { Schema } from "mongoose";

export interface IChat {
  _id: string;
  sender: string | mongoose.Schema.Types.ObjectId;
  receiver: string | mongoose.Schema.Types.ObjectId;
  conversation: string | mongoose.Schema.Types.ObjectId;
  content: string;
  isRead: boolean;
}

const chatSchema = new Schema<IChat>({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "social_user"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "social_user"
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "social_chats"
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

chatSchema.set('toObject', { virtuals: true });
chatSchema.set('toJSON', { virtuals: true });

chatSchema.index({
    conversation: 1,
    createdAt: -1
});

export const Chat = mongoose.model('social_chats', chatSchema);

