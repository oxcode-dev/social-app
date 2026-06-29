import express from 'express';
import { fetchPost } from '../services/PostService.ts';

export const addComments = async (req: express.Request | any, res: express.Response) => {
    const postId = req.params.id as string;
    
    const auth = req.user;

    const text = req.body.text as string;

    const post = await fetchPost(postId);

    if(!post) {
        return res.status(404).json({
            status: "error",
            message: "Post not found!",
        })
    }

    
    // let response: boolean = await storePostComment(postId, auth.id, comment);
    let response: boolean = true;

    if(!response) {
        return res.status(404).json({
            status: "error",
            message: "Post not found!"
        })
    }

    return res.status(200).json({
        success: true,
        message: "Comment Added"
    });
}