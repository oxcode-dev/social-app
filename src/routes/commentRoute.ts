import express from 'express';
import { auth } from '../middlewares/authMiddleware.ts';
import { deleteComment, getComment, getCommentReplies, likePostComment, unLikePostComment } from '../controllers/CommentController.ts';

const router = express.Router();

router.put('/:id/like', auth, likePostComment);
router.put('/:id/unlike', auth, unLikePostComment);

router.route('/:id/replies')
    .post(auth, getCommentReplies)
    .get(auth, getCommentReplies);

router.route('/:id')
    .delete(auth, deleteComment)
    .get(auth, getComment);

export { router as commentRouter };