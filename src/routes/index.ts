import express from 'express';

import { authRouter } from './authRoute.ts';
import { passwordResetRouter } from './passwordResetRouter.ts';
import { profileRouter } from './profileRouter.ts';
import { postsRouter } from './postRouter.ts';
import { conversationRouter } from './conversationRoute.ts';
import { userRouter } from './userRoute.ts';
import { followingsRouter } from './followingsRoute.ts';
import { Post } from '../models/post.ts';
import { createNotification } from '../services/notificationService.ts';

const routes = (app: express.Application) => {
    app.use('/api/auth', authRouter)
    app.use('/api/password', passwordResetRouter)
    app.use('/api/profile', profileRouter)
    app.use('/api/posts', postsRouter)
    app.use('/api/conversations', conversationRouter)
    app.use('/api/users', userRouter)
    app.use('/api/followings', followingsRouter)

    app.get('/api/test', async (req, res) => {
        // console.log(req.app);
        console.log(req.app.get("io"));
        const post = await Post.findOne({
            'postedBy': '699f80cf00d4b770db122aa5'
        })

        await createNotification({

            io: req.app.get("io"),

            recipient: post?.postedBy,

            sender: '699f80cf00d4b770db122aa5',

            type: "COMMENT",

            post: post.id,
        });
        res.status(200).json({ message: 'Testing API routes' })

        // const posts = await Post.find({
        //     'postedBy': '699f80cf00d4b770db122aa5'
        // })
        // res.status(200).json({ 'posts': posts })
    })
}

export default routes