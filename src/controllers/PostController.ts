import express from 'express';
import { Post } from '../models/post.ts';
import { User } from '../models/user.ts';

interface RequestWithUser extends express.Request {
    user: {
        id: string;
    } | null
}

// export const createPost = async (req: RequestWithUser, res: express.Response) => {
export const createPost = async (req: any, res: express.Response) => {
    try {
        const auth = req?.user;

        if (!auth?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const requestData = {
            caption: req.body.caption as string,
            image: req.body.image as string,
            postedBy: auth.id
        }

        const newPost = await Post.create(requestData);

        let data = {
            status: "success",
            message: "Post Created successfully",
            post: newPost,
        }
        // Access the logged-in user's data via req.user
        res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

// export const getPosts = async (req: RequestWithUser, res: express.Response) => {
export const getPosts = async (req: any, res: express.Response) => {
    try {
        const auth = req?.user;

        const posts = await Post.find()
            .populate("postedBy", "username id first_name last_name")

        let data = {
            posts: posts,   
            status: "success",
            message: "Posts retrieved successfully",
        }
        res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const getPost = async (req: express.Request | any, res: express.Response) => {
    try {
        const auth = req?.user;

        const post = await Post.findById(req.params.id)
            .populate("postedBy", "username id first_name last_name")
            .populate("likes", "username id first_name last_name")
            .populate("savedBy", "username id first_name last_name")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "username id first_name last_name",
                }
            })

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

    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const updatePost = async (req: express.Request | any, res: express.Response) => {
    try {
        const auth = req?.user;

        if (!auth?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const updatedPost = {
            caption: req.body.caption as string,
            image: req.body.image as string,
            postedBy: auth.id
        }

        const post = await Post.findByIdAndUpdate(req.params.id, updatedPost, { new: true})
            .populate("postedBy", "username id first_name last_name")

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

    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const deletePost = async (req: any, res: express.Response) => {
    try {
        const auth = req?.user;

        // const result = await Post.findById(req.params.id)
        const result = await Post.findOneAndDelete({
            _id: req.params.id,
            postedBy: auth.id
        })

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

    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const likeUnlikePost = async (req: any, res: express.Response) => {
    try {
        const auth = req?.user;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send({
                message: "Post not found!",
            })
        }

        let responseMessage;

        if (post.likes.includes(auth.id)) {
            const index = post.likes.indexOf(auth.id);
            post.likes.splice(index, 1);
            await post.save();
            responseMessage = "Post Unliked successfully"
        } else {
            post.likes.push(auth.id)
            await post.save();
            responseMessage = "Post Liked successfully"
        }

        let data = {
            status: "success",
            message: responseMessage,
        }
        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const saveUnsavePost = async (req: express.Request | any, res: express.Response) => {
    try {
        const auth = req.user;
        const user = await User.findById(auth.id)

        if (!user) {
            return res.status(404).send({
                message: "User not found!",
            })
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send({
                message: "Post not found!",
            })
        }
        let responseMessage;

        // @ts-ignore
        if (user.saved.includes(post.id.toString())) {
            user.saved = user.saved.filter((p) => p.toString() !== post.id.toString())
            post.savedBy = post.savedBy.filter((p) => p.toString() !== auth.id.toString())
            await user.save();
            await post.save();

            responseMessage = "Post Unsaved"
        } 
        else {
            // @ts-ignore
            user.saved.push(post.id)
            post.savedBy.push(auth.id)

            await user.save();
            await post.save();

            responseMessage = "Post Saved"
        }

        return res.status(200).json({
            status: "success",
            message: responseMessage
        });
    } catch (error) {
        
    }
}

export const addComments = async (req: express.Request | any, res: express.Response) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).send({
            message: "Post not found!",
        })
    }

    post.comments.push({
        user: req.user._id,
        comment: req.body.comment
    });

    await post.save();

    return res.status(200).json({
        success: true,
        message: "Comment Added"
    });
}
