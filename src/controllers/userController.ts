import express from 'express';
import { User } from '../models/user.ts';
import { type RequestWithUser, type PaginationType } from '../types/index.ts';

export const getAllUsers = async (req: any, res: express.Response) => {

    const users = await User.find()//.select('-password');

    let data = {
        users,
        message: 'Users fetched succesfully!'
    }

    res.status(200).json(data);
}

export const searchUsers = async (req: any, res: express.Response) => {

    const searchQuery = req.query?.search || '';

    if (!searchQuery) {
        return res.status(400).json({ msg: "Please enter a search query." });
    }

    const users = await User.find({
      $or: [
        { email: searchQuery.toLowerCase() },
        { username: searchQuery.toLowerCase() }
      ]
    });


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
        message: "Suggested users retrieved successfully!!!",
        metadata: {
            page: page,
            perPage: limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        }
    });
}