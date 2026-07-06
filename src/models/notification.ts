import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "social_user",
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "social_user",
        required: true
    },

    type: {
        type: String,
        enum: [
            "FOLLOW",
            "LIKE",
            "COMMENT",
            "COMMENT_REPLY",
            "MESSAGE",
            "MENTION"
        ],
        required: true
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },

    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },

    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },

    isRead: {
        type: Boolean,
        default: false
    }

},{
    timestamps:true
});

notificationSchema.index({
    recipient:1,
    createdAt:-1
});

export const Notification = mongoose.model('social_notifications', notificationSchema);
