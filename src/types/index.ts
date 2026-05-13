import express from 'express';
import mongoose from 'mongoose';

export interface IUser {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    fullName?: string;
    username: string;
    avatar?: string | null;
    bio?: string | null;
    id: string;
    saved: string[]; // Assuming these are post IDs
    followers: string[]; // Assuming these are user IDs
    followings: string[]; // Assuming these are user IDs
}

export interface AuthUserType {
    _id: string;
    id: string;
    first_name: string;
    last_name: string;
    fullName?: string;
    email: string;
    username: string;
    avatar?: string | null;
    bio?: string | null;
    posts:  string[]; // Assuming these are post IDs
    saved: string[]; // Assuming these are post IDs
    followers: string[]; // Assuming these are user IDs
    followings: string[]; // Assuming these are user IDs
}

export interface DataStoredInToken {
  id: string;
  email: string;
}

export interface RequestWithUser extends express.Request {
    user: Pick<AuthUserType, 'id' | 'email' | '_id'>
}

export type PaginationType = {
    page: number;
    limit: number;
    skip: number;
}

export interface IPost {
    caption: string;
    image?: string | null;
    postedBy: string | mongoose.Schema.Types.ObjectId;
    likes: mongoose.Schema.Types.ObjectId[];
    comments: {
        user: string | mongoose.Schema.Types.ObjectId;
        comment: string;
    }[];
    savedBy: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
}