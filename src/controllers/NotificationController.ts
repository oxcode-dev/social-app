import express from 'express';
import { type PaginationType, RequestWithUser } from '../types/index.ts';

export const getFeedPosts = async (req: express.Request | PaginationType | RequestWithUser, res: express.Response) => {
    const { page, limit, skip } = req as PaginationType;

    const user =  req.user as RequestWithUser;

    const totalCount = 0//await countFeedPosts(feedUsers);
    const posts = 0 // fetchFeedPosts(feedUsers, skip, limit);

    let data = {
        posts: posts, 
        status: "success",
        message: "Posts retrieved successfully",
        metadata: {
            page: page,
            perPage: limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        }
    }

    res.status(200).json(data);
}