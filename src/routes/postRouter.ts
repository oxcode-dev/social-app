import express from 'express';

import { validateInputData } from '../middlewares/validate.ts';
import { 
    createPost, deletePost, getFeedPosts, getPost, getPosts, getUserPosts, likeUnlikePost, 
    saveUnsavePost, updatePost 
} from '../controllers/PostController.ts';
import { auth } from '../middlewares/authMiddleware.ts';
import { postDetailsSchema } from '../validations/postSchema.ts';
import { handlePagination } from '../middlewares/handlePagination.ts';

const router = express.Router();

router.route('/')
    .get(auth, handlePagination as any, getPosts as any)
    .post(auth, validateInputData(postDetailsSchema), createPost as any);

router.get('/user/:userId', auth, handlePagination as any, getUserPosts as any);

router.post('/:id/like', auth, likeUnlikePost)
router.delete('/:id/unlike', auth, likeUnlikePost)

router.post('/:id/save', auth, saveUnsavePost)
router.delete('/:id/unsave', auth, saveUnsavePost)

router.get('/feeds', auth, handlePagination as any, getFeedPosts as any);

router.route('/:id')
    .get(auth, getPost)
    .delete(auth, deletePost)
    .put(auth, validateInputData(postDetailsSchema), updatePost);

export { router as postsRouter };