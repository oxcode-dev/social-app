import express from 'express';
import { fetchPost } from '../services/PostService.ts';
import { fetchPostComment, storePostComment } from '../services/commentRepository.ts';

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
        post: postId, 
        user: auth.id, 
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
    const commentId = req.params.id as string;

    const auth = req.user;

    const text = req.body.text as string;

    const comment = await fetchPostComment(commentId);

    if(!comment) {
        return res.status(404).json({
            status: "error",
            message: "Post not found!",
        })
    }
    
    await storePostComment({
        post: comment.post.toString() || '', 
        user: auth.id, 
        text,
        parentCommentId: commentId
    });

    return res.status(200).json({
        success: true,
        message: "Comment Added"
    });
}