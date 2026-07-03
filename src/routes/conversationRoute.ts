import express from 'express';
import { 
    deleteConversation, getChatConversations, getConversations, getConversationById, sendMessage 
} from '../controllers/conversationController.ts';
import { auth } from '../middlewares/authMiddleware.ts';

const router = express.Router();

router.route('/')
    .post(auth, sendMessage)
    .get(auth, getConversations)

router.route('/:conversationId')
    .get(auth, getConversationById)
    .delete(auth, deleteConversation)

router.get('/:chatId', getChatConversations);

export { router as conversationRouter };