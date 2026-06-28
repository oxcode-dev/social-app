import mongoose, { Schema } from "mongoose";
import { type IPost } from "../types/index.ts";

const postSchema = new Schema<IPost>({
    caption: {
        type: String,
        trim: true
    },
    image: {
        type: String
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "social_user",
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "social_user",
        }
    ],
    commentsCount:{
        type:Number,
        default:0
    },
    savedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "social_user",
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

export const Post = mongoose.model('social_post', postSchema);