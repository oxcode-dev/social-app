import express from 'express';
import { User } from '../models/user.ts';
import { type RequestWithUser, type PaginationType } from '../types/index.ts';
import { fetchUserById, fetchUserByIdAndFollowerId, followUserSystem, unfollowUserSystem } from '../services/userServices.ts';

export const getAllUsers = async (req: any, res: express.Response) => {
    const users = await User.find()//.select('-password');

    let data = {
        users,
        message: 'Users fetched succesfully!'
    }

    res.status(200).json(data);
}

export const getUserDetails = async (req: express.Request, res: express.Response) => {
    const user_id = String(req.params?.id || '');

    const user = await fetchUserById(user_id);

    if (!user) {
        res.status(400).json({ msg: "User does not exist." });
    }

    let data = {
        status: "success",
        message: "User details retrieved successfully",
        user: {
            id: user?.id,
            fullName: user?.first_name + ' ' + user?.last_name,
            email: user?.email,
            first_name: user?.first_name,
            last_name: user?.last_name,
            username: user?.username,
            avatar: user?.avatar,
            bio: user?.bio,
        },
    }

    res.status(200).json(data);
}

export const followUser = async (req: RequestWithUser, res: express.Response) => {
    const auth = req?.user;
    const userIdToFollow = String(req?.params?.id || '');

    const user = await fetchUserByIdAndFollowerId(userIdToFollow, auth?.id)

    if (user.length > 0) {
        return res.status(400).json({ msg: "You are already following this user." });
    }

    await followUserSystem(userIdToFollow, auth?.id);

    res.json({ 
        status: 'success',
        message: 'User followed successful'
    });
}

export const unfollowUser = async (req: RequestWithUser, res: express.Response) => {
    const auth = req?.user;
    const userIdToUnfollow = String(req?.params?.id || '');

    await unfollowUserSystem(userIdToUnfollow, auth?.id);

    res.json({
        status: 'success',
        message: 'User unfollowed successful'
    });
}

export const getUserFollowers = async (req: any, res: express.Response) => {
    const user_id = req.params.id

    const user = await User.findById(user_id)
        .populate({
            path: "followers",
            select: "username id first_name last_name email",
        })

    if (!user) {
        res.status(400).json({ msg: "User does not exist." });
    }

    let data = {
        status: "success",
        message: "User followers retrieved successfully",
        followers: user?.followers || [],
    }

    res.status(200).json(data);
}

export const getUserFollowings = async (req: any, res: express.Response) => {
    const user_id = req.params.id

    const user = await User.findById(user_id)
        .populate({
            path: "followings",
            select: "username id first_name last_name email",
        })

    if (!user) {
        res.status(400).json({ msg: "User does not exist." });
    }

    let data = {
        status: "success",
        message: "User followings retrieved successfully",
        followings: user?.followings || [],
    }

    res.status(200).json(data);
}

export const getSuggestedUsers = async (req: any, res: express.Response) => {

    const { page, limit, skip } = req as PaginationType;

    const excludedUsers = [...req.user.followings, req.user._id];

    const totalCount = await User.countDocuments({
        _id: { $nin: excludedUsers },
    })

    const users = await User.find({
            _id: { $nin: excludedUsers },
        })
        .select("first_name last_name username email avatar bio")
        .sort({ followersCount: -1 })
        .skip(skip)
        .limit(limit);

    return res.json({
        status: "success",
        users,
        message: "Products retrieved successfully!!!",
        metadata: {
            page: page,
            perPage: limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        }
    });
    
}