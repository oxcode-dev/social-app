import express from 'express';

export const addComments = async (req: express.Request | any, res: express.Response) => {
    const postId = req.params.id as string;
    const auth = req.user;

    const comment = req.body.comment as string;
    
    // let response: boolean = await storePostComment(postId, auth.id, comment);
    let response: boolean = true;

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