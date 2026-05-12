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