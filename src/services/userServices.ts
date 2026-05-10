import { User } from "../models/user.ts";
import type { IUser } from "../types/index.ts";


export const fetchUserByEmail = async (email: string) => {
    return await User.findOne({ email });
}

export const fetchUserByEmailForAuth = async (email: string) => {
    return await User.findOne({ email }).select('+password');
}

export const fetchUserById = async (id: string) => {
    return await User.findById(id);
}

export const storeUser = async (user: Omit<IUser, '_id' | 'id' |'posts' | 'saved' | 'followers' | 'followings'>) => {

    const newUser = new User(user);

    return await newUser.save();
}