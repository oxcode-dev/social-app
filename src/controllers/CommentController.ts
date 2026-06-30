import express from 'express';
import { fetchPost } from '../services/PostService.ts';
import { 
    deleteCommentPost, fetchComment, storePostComment, likeComment, unLikeComment,
    countCommentsByPostId, fetchCommentsByPostId,
    countCommentReplies,
    fetchCommentReplies,
} from '../services/commentRepository.ts';
import { PaginationType } from '../types/index.ts';

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

export const getPostComments = async (req: any, res: express.Response) => {
    const postId = req.params.id as string;

    const { page, limit, skip } = req as PaginationType;

    const totalCount = await countCommentsByPostId(postId);
    const comments = await fetchCommentsByPostId(postId, skip, limit);

    let data = {
        comments: comments, 
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

export const replyToComment = async (req: express.Request | any, res: express.Response) => {
    const commentId = req.params.id as string;

    const auth = req.user;

    const text = req.body.text as string;

    const comment = await fetchComment(commentId);

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

export const getCommentReplies = async (req: any, res: express.Response) => {
    const commentId = req.params.id as string;

    const { page, limit, skip } = req as PaginationType;    

    const totalCount = await countCommentReplies(commentId);
    const replies = await fetchCommentReplies(commentId, skip, limit);

    let data = {
        replies: replies, 
        status: "success",
        message: "Comment replies retrieved successfully",
        metadata: {
            page: page,
            perPage: limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        }
    }

    res.status(200).json(data);
}

export const deleteComment = async (req: express.Request | any, res: express.Response) => {
    const commentId = req.params.id as string;

    const auth = req.user;

    await deleteCommentPost(commentId, auth.id);

    return res.status(200).json({
        success: true,
        message: "Comment Deleted Successfully!"
    })
}

export const likePostComment = async (req: express.Request | any, res: express.Response) => {
    const commentId = req.params.id as string;
    const auth = req.user;

    await likeComment(commentId, auth.id);

    return res.status(200).json({
        success: true,
        message: "Comment Liked Successfully!"
    })
}

export const unLikePostComment = async (req: express.Request | any, res: express.Response) => {
    const commentId = req.params.id as string;
    const auth = req.user;

    await unLikeComment(commentId, auth.id);

    return res.status(200).json({
        success: true,
        message: "Comment Unliked Successfully!"
    })
}