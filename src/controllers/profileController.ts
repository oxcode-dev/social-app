import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.ts';
import { type RequestWithUser } from '../types/index.ts';
import { fetchUserById, updateUserDetails, updateUserPassword } from '../services/userServices.ts';
import { deletePostsByUserId } from '../services/PostService.ts';

export const getUserDetails = async (req: RequestWithUser, res: express.Response) => {
    const auth = req?.user

    const user = await fetchUserById(auth?.id)

    if (!user) {
        res.status(400).json({ msg: "User does not exist." });
    }

    let data = {
        status: "success",
        message: "Profile retrieved successfully",
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

export const updateUserProfile = async (req: RequestWithUser, res: express.Response) => {
    const auth = req?.user
    
    const user = await fetchUserById(auth?.id)

    if(!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    const { first_name, last_name, email, bio, username } = req.body;

    const updatedUser = await updateUserDetails(user?.id, {
        first_name: first_name,
        last_name: last_name,
        email: email,
        username: username,
        bio: bio || user?.bio,
    })

    let data = {
        user: {
            id: updatedUser?.id,
            fullName: updatedUser?.first_name + ' ' + updatedUser?.last_name,
            email: updatedUser?.email,
            first_name: updatedUser?.first_name,
            last_name: updatedUser?.last_name,
            username: updatedUser?.username,
            avatar: updatedUser?.avatar,
            bio: updatedUser?.bio,
        },
        status: "success",
        message: "Profile updated successfully",
    };
    res.status(201).json(data);
}

export const changePassword = async (req: RequestWithUser, res: express.Response) => {
    const auth = req.user;

    const user = await fetchUserById(auth?.id)

    if(!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    await updateUserPassword(user._id, { password: hashedPassword })

    let data = {
        status: "success",
        message: "Password changed successfully",
    };
    res.status(201).json(data);
}

export const deleteProfile = async (req: RequestWithUser, res: express.Response) => {

    const user = await User.findById(req.user?.id);

    await deletePostsByUserId(user?.id || '');

    const userId = user?.id;

    // delete post & user images ⚠️⚠️
    const result = await User.findByIdAndDelete(userId);

    res.cookie('token', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Profile Deleted"
    });
};