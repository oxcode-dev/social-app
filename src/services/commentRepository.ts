import { Comment } from "../models/comment.ts";


type storePostCommentType = {
    post: string,
    user: string, 
    text: string, 
    parentCommentId: string | null
}

export const fetchPostComment = async (commentId: string) => {
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

export const likePostComment = async (commentId: string, userId: string) => {
    const comment = await Comment.findByIdAndUpdate(commentId, {
        $addToSet: { likes: userId }
    }, { new: true });

    if(!comment) {
        throw new Error("Comment not found");
    }

    return comment;
}

export const unLikePostComment = async (commentId: string, userId: string) => {
    const comment = await Comment.findByIdAndUpdate(commentId, {
        $pull: { likes: userId }
    }, { new: true });

    if(!comment) {
        throw new Error("Comment not found");
    }

    return comment;
}