import express from 'express';
import { User } from '../models/user.ts';
import { type RequestWithUser, type PaginationType } from '../types/index.ts';
import { fetchUserAndFollowingsById, fetchUserById, fetchUserByIdAndFollowerId, followUserSystem, unfollowUserSystem } from '../services/userServices.ts';

export const getAllUsers = async (req: any, res: express.Response) => {
    const users = await User.find()//.select('-password');

    let data = {
        users,
        message: 'Users fetched succesfully!'
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