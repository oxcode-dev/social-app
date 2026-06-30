import express from 'express';
import { fetchPost } from '../services/PostService.ts';
import { storePostComment } from '../services/commentRepository.ts';

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

    
    let response = await storePostComment({
        postId, 
        userId: auth.id, 
        text,
        parentCommentId: null
    });

    return res.status(200).json({
        success: true,
        message: "Comment Added",
        comment: response,
    });
}

export const replyToComment = async (req: express.Request | any, res: express.Response) => {
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

    
    let response = await storePostComment({
        postId, 
        userId: auth.id, 
        text,
        parentCommentId: null
    });

    return res.status(200).json({
        success: true,
        message: "Comment Added"
    });
}