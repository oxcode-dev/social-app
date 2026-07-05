import express from 'express';
import { 
    deleteConversation, getConversationChats, getConversations, getConversationById, sendMessage, 
    deleteChat,
    markAsRead
} from '../controllers/conversationController.ts';
import { auth } from '../middlewares/authMiddleware.ts';

const router = express.Router();

router.route('/')
    .post(auth, sendMessage)
    .get(auth, getConversations)

router.delete('/chats/:chatId/delete', auth, deleteChat);

router.get('/:conversationId/chats/mark-as-read', auth, markAsRead);
router.get('/:conversationId/chats', auth, getConversationChats);

router.route('/:conversationId')
    .get(auth, getConversationById)
    .delete(auth, deleteConversation)

export { router as conversationRouter };