import mongoose, { Schema } from "mongoose";

interface IPost {
    caption: string;
    image: string;
    postedBy: string | mongoose.Schema.Types.ObjectId;
    likes: mongoose.Schema.Types.ObjectId[];
    comments: {
        user: mongoose.Schema.Types.ObjectId;
        comment: string;
    }[];
    savedBy: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
}

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
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "social_user",
            },
            comment: {
                type: String,
                required: true,
                trim: true,
            }
        }
    ],
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