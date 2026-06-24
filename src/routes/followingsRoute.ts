import express from 'express';
import { auth } from '../middlewares/authMiddleware.ts';
import { followUser, getUserFollowers, getUserFollowings, unfollowUser } from '../controllers/FollowerController.ts';

const router = express.Router();

router.put('/:id/follow', auth, followUser as any)

router.put('/:id/unfollow', auth, unfollowUser as any)

router.get('/:id/followers', auth, getUserFollowers)

router.get('/:id/followings', auth, getUserFollowings)