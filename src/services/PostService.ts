import { Post } from "../models/post.ts"
import { User } from "../models/user.ts"
import { type IPost } from "../types/index.ts"

export const storePost = async (data: Pick<IPost, 'caption' | 'image' | 'postedBy'>) => {
    return await Post.create(data)
}

export const countAllPosts = async () => {
    return await Post.countDocuments();
}

export const countAllUserPosts = async (userId: string) => {
    return await Post.countDocuments({ postedBy: userId });
}

export const fetchAllPostsWithPagination = async (skip: number, limit: number) => {
    return await Post.find()
        .populate("postedBy", "username id first_name last_name")
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit)
}

export const fetchUserPostsWithPagination = async (userId: string, skip: number, limit: number) => {
    return await Post.find({ postedBy: userId})
        .populate("postedBy", "username id first_name last_name")
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit)
}

export const countFeedPosts = async (userIds: string[]) => {
    return await Post.countDocuments({ postedBy: { $in: userIds } });
}

export const fetchFeedPosts = async (userIds: string[], skip: number, limit: number) => {
    return await Post.find({ 
            postedBy:{
                $in: userIds
            }
        })
        .populate("postedBy", "username id first_name last_name")
        .populate("likes", "username id first_name last_name")
        .populate("savedBy", "username id first_name last_name")
        .sort({ createdAt: -1})
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
        return response;
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

export const saveUnsavePostSystem = async (postId: string, userId: string) => {
    let response = {
        error: false,
        message: "",
    };
    const user = await User.findById(userId)

    if (!user) {
        response.error = true;
        response.message = "User not found!";
        return response;
    }

    const post = await Post.findById(postId);

    if (!post) {
        response.error = true;
        response.message = "Post not found!";
        return response;
    }

    if (user.saved.includes(post.id.toString())) {
        user.saved = user.saved.filter((p) => p.toString() !== post.id.toString())
        post.savedBy = post.savedBy.filter((p) => p.toString() !== userId.toString())
        await user.save();
        await post.save();

        response.message = "Post Unsaved"
    } 
    else {
        user.saved.push(post.id)
        post.savedBy.push(userId)

        await user.save();
        await post.save();

        response.message = "Post Saved"
    }
    return response;
}