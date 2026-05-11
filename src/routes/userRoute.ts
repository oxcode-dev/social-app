import express from 'express';
import { followUser, getAllUsers, getSuggestedUsers, getUserDetails, getUserFollowers, getUserFollowings, unfollowUser } from '../controllers/userController.ts';
import { auth } from '../middlewares/authMiddleware.ts';

const router = express.Router();

router.route('/')
    .get(getAllUsers)

router.get("/suggestions", auth, getSuggestedUsers);

router.put('/:id/follow', auth, followUser)

router.put('/:id/unfollow', auth, unfollowUser)

router.get('/:id/followers', auth, getUserFollowers)

router.get('/:id/followings', auth, getUserFollowings)



router.get('/:id', getUserDetails)



export { router as userRouter };