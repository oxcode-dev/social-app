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
import { addData, deleteData, getAllData, updateData } from '../database/sqlCalls.ts';


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

            // const newCar = {
            //     year: 2019,
            //     make: "Nissan",
            //     model: "Micra"
            // }

            // const saveCar = await addData('cars', newCar);

            // console.log(saveCar);

            // const cars = await getAllData('cars');

            // return res.json(cars);

            const newUser = {
                email: "take@care.com",
                name: "Fridday234"
            }

            const condition = `
                email = '${newUser.email}',
                name = '${newUser.name}'
            `;
            const key = `id = 1 AND email = 'take@care.com'`

            // const saveUser = await deleteData('users', key);
            const saveUser = await updateData('users', condition, key);
            // const saveUser = await addData('users', newUser);

            console.log(saveUser);

            const cars = await getAllData('users', "email, name");

            return res.json(cars);
        } catch (error) {
            res.status(500).json({ error: 'Database query failed ' + error });
        }
    })
}

export default routes