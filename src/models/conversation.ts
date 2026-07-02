import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
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
        },
            lastActivity: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

conversationSchema.index({
    recipients: 1
});

conversationSchema.index({
    lastActivity: -1
});

conversationSchema.set('toObject', { virtuals: true });
conversationSchema.set('toJSON', { virtuals: true });

export const Conversation = mongoose.model('social_chats', conversationSchema);