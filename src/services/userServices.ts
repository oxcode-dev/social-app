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

export const updateUserPassword = async (id: string, userData: Pick<IUser, 'password'>) => {
    return await User.findByIdAndUpdate(id, userData, {new: true});
} 

export const updateUserDetails = async (id: string, userData: Partial<IUser>) => {
    return await User.findByIdAndUpdate(id, userData, {new: true});
}

export const storeUser = async (user: Omit<IUser, '_id' | 'id' |'posts' | 'saved' | 'followers' | 'followings'>) => {

    const newUser = new User(user);

    return await newUser.save();
}

export const fetchUserByIdAndFollowerId = async (userId: string, followerId: string) => {
    return await User.find({
        _id: userId,
        followers: followerId,
    });
}


export const followUserSystem = async (userIdToFollow: string, followerId: string) => {
    await User.findOneAndUpdate(
        { _id: userIdToFollow},
        {
            $push: {
                followers: followerId
            },
        },
        { new: true }
    )

    await User.findOneAndUpdate(
        { _id: followerId },
        { $push: { followings: userIdToFollow } },
        { new: true }
    );
}