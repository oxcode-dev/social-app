import { Post } from "../models/post.ts"
import { IPost } from "../types/index.ts"

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