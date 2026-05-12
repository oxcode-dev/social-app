import { Post } from "../models/post.ts"
import { IPost } from "../types/index.ts"

export const storePost = async (data: Pick<IPost, 'caption' | 'image' | 'postedBy'>) => {
    return await Post.create(data)
}