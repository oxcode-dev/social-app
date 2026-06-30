import express from 'express';
import { auth } from '../middlewares/authMiddleware.ts';
import { getComment } from '../controllers/CommentController.ts';

const router = express.Router();

router.route('/:id')
    .delete(auth, getComment)
    .get(auth, getComment);

export { router as commentRouter };