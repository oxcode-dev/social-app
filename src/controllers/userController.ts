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

     // 1. Sanitize user input to escape special regex characters
    const safeSearchTerm = searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // 2. Create a case-insensitive regular expression
    const regex = new RegExp(safeSearchTerm, 'i');

    // 3. Query using $or to search both fields
    const users = await User.find({
        $or: [
            { username: { $regex: regex } },
            { email: { $regex: regex } }
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