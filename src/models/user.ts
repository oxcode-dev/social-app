import mongoose, { Schema } from "mongoose";
import type { IUser } from "../types/index.ts";

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: [true, "Email already exists"],
    },
    username: {
        type: String,
        required: [true, "Please enter username"],
        minlength: [6, "Username must be of minimum 6 characters"],
        unique: [true, "Username already exists"],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    first_name: {
        type: String,
        required: [true, "Please enter name"]
    },
    last_name: {
        type: String,
        required: [true, "Please enter name"]
    },
    avatar: {
        type: String
    },
    bio: {
        type: String,
        default: "Hi👋 Welcome To My Profile"
    },
    saved: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "social_user",
        }
    ],
    followings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "social_user",
        }
    ],
}, {timestamps: true});

userSchema
	.virtual("fullName")
	.get(function () {
		return this.first_name + " " + this.last_name;
	});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

export const User = mongoose.model('social_user', userSchema);