import express from 'express';
import { deleteChats, getChatConversations, getConversations, sendMessage } from '../controllers/conversationController.ts';
import { auth } from '../middlewares/authMiddleware.ts';

const router = express.Router();

router.route('/')
    .post(auth, sendMessage)
    .get(auth, getConversations)

router.delete('/:chatId', deleteChats)

router.get('/:chatId', getChatConversations);

export { router as chatsRouter };