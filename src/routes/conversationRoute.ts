import express from 'express';
import { deleteConversation, getChatConversations, getConversations, sendMessage } from '../controllers/conversationController.ts';
import { auth } from '../middlewares/authMiddleware.ts';

const router = express.Router();

router.route('/')
    .post(auth, sendMessage)
    .get(auth, getConversations)

router.delete('/:chatId', deleteConversation)

router.get('/:chatId', getChatConversations);

export { router as conversationRouter };