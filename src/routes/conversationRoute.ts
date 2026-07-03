import express from 'express';
import { 
    deleteConversation, getConversationChats, getConversations, getConversationById, sendMessage, 
    deleteChat
} from '../controllers/conversationController.ts';
import { auth } from '../middlewares/authMiddleware.ts';

const router = express.Router();

router.route('/')
    .post(auth, sendMessage)
    .get(auth, getConversations)

router.delete('/chats/:chatId/delete', deleteChat);

router.get('/:conversationId/chats', getConversationChats);

router.route('/:conversationId')
    .get(auth, getConversationById)
    .delete(auth, deleteConversation)

export { router as conversationRouter };