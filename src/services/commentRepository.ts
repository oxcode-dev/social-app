import { populate } from "dotenv";
import { Comment } from "../models/comment.ts";


type storePostCommentType = {
    post: string,
    user: string, 
    text: string, 
    parentCommentId: string | null
}

export const countCommentsByPostId = async (postId: string) => {
    return await Comment.countDocuments({ post: postId, parentComment: null });
}

export const fetchCommentsByPostId = async (postId: string, skip: number, limit: number) => {
    return await Comment.find({ post: postId, parentComment: null })
        .populate("user", "username id first_name last_name")
        .populate("post", "caption image id")
        .populate("replies", "text user createdAt") 
        .skip(skip)
        .limit(limit)
}

export const fetchComment = async (commentId: string) => {
    return await Comment.findById(commentId)
        .populate("user", "username id first_name last_name")
        .populate("post", "caption image id")
        .populate("replies", "text user createdAt");    
}

export const storePostComment = async (commentData: storePostCommentType) => {
    
    const comment = await Comment.create(commentData);

    if(commentData.parentCommentId) {
        await comment.updateOne(
            { $inc: { repliesCount: 1 } }
        );
    }

    return comment;

}

export const likeComment = async (commentId: string, userId: string) => {
    const comment = await Comment.findByIdAndUpdate(commentId, {
        $addToSet: { likes: userId }
    }, { new: true });

    if(!comment) {
        throw new Error("Comment not found");
    }

    return comment;
}

export const unLikeComment = async (commentId: string, userId: string) => {
    const comment = await Comment.findByIdAndUpdate(commentId, {
        $pull: { likes: userId }
    }, { new: true });

    if(!comment) {
        throw new Error("Comment not found");
    }

    return comment;
}

export const deleteCommentPost = async (commentId: string, userId: string) => {
    await Comment.deleteMany({
        parentComment: commentId,
    })

    return await Comment.findOneAndDelete({
        _id: commentId,
        user: userId,
    })
}

export const countCommentReplies = async (commentId: string) => {
    return await Comment.countDocuments({ parentComment: commentId });
}

export const fetchCommentReplies = async (commentId: string, skip: number, limit: number) => {
    return await Comment.find({ parentComment: commentId })
        .populate("user", "username id first_name last_name")
        .populate("post", "caption image id")
        .populate("replies", "text user createdAt") 
        .skip(skip)
        .limit(limit)
}       