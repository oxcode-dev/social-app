import express from 'express';
import { deleteChats, getChatConversations, getChats, sendMessage } from '../controllers/conversationController.ts';
import { auth } from '../middlewares/authMiddleware.ts';

const router = express.Router();

router.route('/')
    .post(auth, sendMessage)
    .get(auth, getChats)

router.delete('/:chatId', deleteChats)

router.get('/:chatId', getChatConversations);

export { router as chatsRouter };