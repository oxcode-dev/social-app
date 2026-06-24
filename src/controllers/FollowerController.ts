import express from 'express';
import { fetchUserAndFollowingsById, fetchUserByIdAndFollowerId, followUserSystem, unfollowUserSystem } from "../services/userServices.ts";
import { RequestWithUser } from '../types/index.ts';

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


    const user = await fetchUserAndFollowingsById(user_id)

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

    const user = await fetchUserAndFollowingsById(user_id);

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