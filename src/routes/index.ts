import express from 'express';

import { authRouter } from './authRoute.ts';
import { passwordResetRouter } from './passwordResetRouter.ts';
import { profileRouter } from './profileRouter.ts';
import { postsRouter } from './postRouter.ts';
import { chatsRouter } from './chatRoute.ts';
import { userRouter } from './userRoute.ts';

const routes = (app: express.Application) => {
    app.use('/api/auth', authRouter)
    app.use('/api/password', passwordResetRouter)
    app.use('/api/profile', profileRouter)
    app.use('/api/posts', postsRouter)
    app.use('/api/chats', chatsRouter)
    app.use('/api/users', userRouter)

    app.get('/api/test', (req, res) => {
        res.status(200).json({ message: 'Testing API routes' })
    })
}

export default routes