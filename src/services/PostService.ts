import { Post } from "../models/post.ts"
import { type IPost } from "../types/index.ts"

export const storePost = async (data: Pick<IPost, 'caption' | 'image' | 'postedBy'>) => {
    return await Post.create(data)
}

export const countAllPosts = async () => {
    return await Post.countDocuments();
}

export const fetchAllPostsWithPagination = async (skip: number, limit: number) => {
    return await Post.find()
        .populate("postedBy", "username id first_name last_name")
        .skip(skip)
        .limit(limit)
}

export const fetchPost = async (id: string) => {
    return await Post.findById(id)
        .populate("postedBy", "username id first_name last_name")
        .populate("likes", "username id first_name last_name")
        .populate("savedBy", "username id first_name last_name")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username id first_name last_name",
            }
        });
}

export const editPost = async (id: string, data: Pick<IPost, 'caption' | 'image' | 'postedBy'>) => {
    return await Post.findByIdAndUpdate(id, data, { new: true})
        .populate("postedBy", "username id first_name last_name")
}

export const deletePostByIdAndAuthor = async (id: string, author_id: string) => {
    return await Post.findOneAndDelete({
        _id: id,
        postedBy: author_id
    })
}

export const storePostComment = async (postId: string, userId: string, comment: string) => {
    const post = await fetchPost(postId);
    
    if(post) {
        post.comments.push({
            user: userId,
            comment:comment
        });

        await post.save();

        return true
    }

    return false;
}


export const likeUnlikePostSystem = async (postId: string, userId: string) => {
    let response = {
        error: false,
        message: "",
    };

    const post = await fetchPost(postId)

    if (!post) {
        response.error = true;
        response.message = "Post not found!";
        return response;;
    }


    if (post.likes.includes(userId)) {
        const index = post.likes.indexOf(userId);
        post.likes.splice(index, 1);
        await post.save();
        response.message = "Post Unliked successfully"
    } else {
        post.likes.push(userId)
        await post.save();
        response.message = "Post Liked successfully"
    }

    return response;
}