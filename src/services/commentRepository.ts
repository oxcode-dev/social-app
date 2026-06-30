import { Comment } from "../models/comment.ts";


type storePostCommentType = {
    postId: string,
    userId: string, 
    text: string, 
    parentCommentId: string | null
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

// post:{
//     },
//     user:{
//     },
//     text:{
//     },
//     parentComment:{
//     },
//     likes:[
//     ],
//     repliesCount:{
//     }