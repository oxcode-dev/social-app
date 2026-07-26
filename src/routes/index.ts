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
import { notificationRouter } from './notificationRoute.ts';


const routes = (app: express.Application) => {
    app.use('/api/auth', authRouter)
    app.use('/api/password', passwordResetRouter)
    app.use('/api/profile', profileRouter)
    app.use('/api/posts', postsRouter)
    app.use('/api/conversations', conversationRouter)
    app.use('/api/users', userRouter)
    app.use('/api/followings', followingsRouter)
    app.use('/api/notifications', notificationRouter)

    app.get('/api/test', async (req, res) => {

        try {

          return res.json('Api Testing...');
        } catch (error) {
            res.status(500).json({ error: 'Database query failed ' + error });
        }
    })
}

export default routes