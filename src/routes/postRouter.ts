import express from 'express';

import { validateInputData } from '../middlewares/validate.ts';
import { 
    addComments, createPost, deletePost, getPost, getPosts, likeUnlikePost, 
    saveUnsavePost, updatePost 
} from '../controllers/PostController.ts';
import { auth } from '../middlewares/authMiddleware.ts';
import { postCommentSchema, postDetailsSchema } from '../validations/postSchema.ts';

const router = express.Router();

router.route('/')
    .get(auth, getPosts as any)
    .post(auth, validateInputData(postDetailsSchema), createPost);

router.route('/:id')
    .get(auth, getPost)
    .delete(auth, deletePost)
    .put(auth, validateInputData(postDetailsSchema), updatePost);

router.post('/:id/like', auth, likeUnlikePost)
router.delete('/:id/unlike', auth, likeUnlikePost)

router.post('/:id/save', auth, saveUnsavePost)
router.delete('/:id/unsave', auth, saveUnsavePost)

router.post('/:id/comments', auth, validateInputData(postCommentSchema), addComments)

export { router as postsRouter };