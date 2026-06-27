import express from 'express';
import { type PaginationType, type RequestWithUser } from '../types/index.ts';
import { 
    countAllPosts, deletePostByIdAndAuthor, editPost, fetchAllPostsWithPagination, fetchPost, likeUnlikePostSystem, storePost, 
    storePostComment, saveUnsavePostSystem,
    countAllUserPosts,
    fetchUserPostsWithPagination,
} from '../services/PostService.ts';

export const createPost = async (req: RequestWithUser, res: express.Response) => {
    const auth = req?.user;

    const { caption, image } = req.body as { caption: string, image: string | null}

    const newPost = await storePost({
        caption,
        image,
        postedBy: auth?._id
    });

    let data = {
        status: "success",
        message: "Post Created successfully",
        post: newPost,
    }

    res.status(201).json(data);
}

export const getPosts = async (req: RequestWithUser & PaginationType, res: express.Response) => {
    const { page, limit, skip } = req as PaginationType;

    const totalCount = await countAllPosts();
    const posts = await fetchAllPostsWithPagination(skip, limit);

    console.log(posts.length)

    let data = {
        posts: posts,   
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

export const getUserPosts = async (req: RequestWithUser & PaginationType, res: express.Response) => {
    const { page, limit, skip } = req as PaginationType;

    const user_id = req.params.id as string;

    const totalCount = await countAllUserPosts(user_id);
    const posts = await fetchUserPostsWithPagination(user_id, skip, limit);

    console.log(posts.length)

    let data = {
        posts: posts,   
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

export const getPost = async (req: express.Request | any, res: express.Response) => {

    const post = await fetchPost(req.params.id);

    if (!post) {
        return res.status(404).send({
            message: "Post not found!",
        })
    }

    let data = {
        post: post,   
        status: "success",
        message: "Posts retrieved successfully",
    }
    res.status(200).json(data);
}

export const updatePost = async (req: express.Request | any, res: express.Response) => {
    const auth = req?.user;

    const { caption, image } = req.body as { caption: string, image: string | null}
    
    const post = await editPost(req.params.id, {
        caption,
        image,
        postedBy: auth.id
    })

    if (!post) {
        return res.status(404).send({
            message: "Post not found!",
        })
    }

    let data = {
        status: "success",
        message: "Post Updated Successfully",
        post: post,
    }

    res.status(200).json(data);
}

export const deletePost = async (req: any, res: express.Response) => {
    const auth = req?.user;

    const result = await deletePostByIdAndAuthor(req.params.id, auth.id)

    if (!result) {
        return res.status(404).send({
            message: "Post not found!",
        })
    }

    let data = {
        deletedPost: result,   
        status: "success",
        message: "Posts deleted successfully",
    }
    res.status(200).json(data);
}

export const likeUnlikePost = async (req: any, res: express.Response) => {
    const auth = req?.user;

    let response = await likeUnlikePostSystem(req.params.id, auth.id);

    if (response.error) {
        return res.status(404).json({
            message: response.message
        })
    }

    res.status(200).json({
        status: "success",
        message: response.message,
    });
}

export const saveUnsavePost = async (req: express.Request | any, res: express.Response) => {
    const auth = req.user;
    
    let response = await saveUnsavePostSystem(req.params.id, auth.id);

    if (response.error) {
        return res.status(404).json({
            message: response.message
        })
    }

    res.status(200).json({
        status: "success",
        message: response.message,
    });
}

export const addComments = async (req: express.Request | any, res: express.Response) => {
    const postId = req.params.id as string;
    const auth = req.user;

    const comment = req.body.comment as string;
    
    let response: boolean = await storePostComment(postId, auth.id, comment);

    if(!response) {
        return res.status(404).json({
            status: "error",
            message: "Post not found!"
        })
    }

    return res.status(200).json({
        success: true,
        message: "Comment Added"
    });
}