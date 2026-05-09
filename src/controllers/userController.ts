import express from 'express';
import { User } from '../models/user.ts';

export const getAllUsers = async (req: any, res: express.Response) => {
    try {
        // const auth = req?.user;
        const users = await User.find().select('-password');

        let data = {
            users,
            message: 'Users fetched succesfully!'
        }

        // return res.status(200).json(data)
        res.status(200).json(data);

        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const getUserDetails = async (req: any, res: express.Response) => {
    try {
        const user_id = req.params.id

        const user = await User.findById(user_id).select('-password')

        if (!user) {
            res.status(400).json({ msg: "User does not exist." });
        }

        let data = {
            status: "success",
            message: "User details retrieved successfully",
            user_d: user,
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
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const followUser = async (req: any, res: express.Response) => {
    try {
        const auth = req?.user;
        const user = await User.find({
            _id: req.params.id,
            followers: auth?.id,
        });

        if (user.length > 0) {
            return res.status(400).json({ msg: "You are already following this user." });
        }

        await User.findOneAndUpdate(
            { _id: req.params.id },
            {
                $push: {
                    followers: auth?.id
                },
            },
            { new: true }
        )

        await User.findOneAndUpdate(
            { _id: auth?.id },
            { $push: { followings: req.params.id } },
            { new: true }
        );

        res.json({ 
            status: 'success',
            message: 'User followed successful'
        });
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})   
    }
}

export const unfollowUser = async (req: any, res: express.Response) => {
    try {
        const auth = req?.user;
    
        await User.findOneAndUpdate(
            { _id: req.params.id },
            {
                $pull: { followers: auth?.id }
            },
            { new: true }
        )

        await User.findOneAndUpdate(
            { _id: auth?.id },
            { $pull: { followings: req.params.id } },
            { new: true }
        );

        res.json({
            status: 'success',
            message: 'User unfollowed successful'
        });
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})   
    }
}

export const getUserFollowers = async (req: any, res: express.Response) => {
     try {
        const user_id = req.params.id

        const user = await User.findById(user_id)
            .populate({
                path: "followers",
                select: "username id first_name last_name",
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
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const getUserFollowings = async (req: any, res: express.Response) => {
     try {
        const user_id = req.params.id

        const user = await User.findById(user_id)
            .populate({
                path: "followings",
                select: "username id first_name last_name",
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
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}