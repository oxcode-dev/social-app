import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        recipients: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "social_user"
            }
        ],
        latestMessage: {
            type: String,
            required: true,
            trim: true,
        }
    },
    { timestamps: true }
);

chatSchema.set('toObject', { virtuals: true });
chatSchema.set('toJSON', { virtuals: true });

export const Chat = mongoose.model('social_chats', chatSchema);