import express from 'express';
import { getAllUsers, getSuggestedUsers } from '../controllers/userController.ts';
import { auth } from '../middlewares/authMiddleware.ts';
import { handlePagination } from '../middlewares/handlePagination.ts';

const router = express.Router();

router.route('/')
    .get(getAllUsers)

router.get("/suggestions", auth, handlePagination as any, getSuggestedUsers);

export { router as userRouter };