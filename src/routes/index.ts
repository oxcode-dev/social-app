import express from 'express';

import { authRouter } from './authRoute.ts';
import { passwordResetRouter } from './passwordResetRouter.ts';
import { profileRouter } from './profileRouter.ts';
import { postsRouter } from './postRouter.ts';
import { chatsRouter } from './chatRoute.ts';
import { userRouter } from './userRoute.ts';
import { followingsRouter } from './followingsRoute.ts';
import { Post } from '../models/post.ts';

const routes = (app: express.Application) => {
    app.use('/api/auth', authRouter)
    app.use('/api/password', passwordResetRouter)
    app.use('/api/profile', profileRouter)
    app.use('/api/posts', postsRouter)
    app.use('/api/chats', chatsRouter)
    app.use('/api/users', userRouter)
    app.use('/api/followings', followingsRouter)

    app.get('/api/test', async (req, res) => {
        res.status(200).json({ message: 'Testing API routes' })

        // const posts = await Post.find({
        //     'postedBy': '699f80cf00d4b770db122aa5'
        // })
        // res.status(200).json({ 'posts': posts })
    })
}

export default routes