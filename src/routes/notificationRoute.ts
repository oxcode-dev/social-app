import express from 'express';
import { auth } from '../middlewares/authMiddleware.ts';
import { deleteNotification, getAllUserNotifications, markAllNotificationsRead, markNotificationRead } from '../controllers/NotificationController.ts';

const router = express.Router();

router.get('/', auth, getAllUserNotifications as any);
router.patch('/:notificationId/read', auth, markNotificationRead as any);
router.patch('/read-all', auth, markAllNotificationsRead as any);

router.delete('/:notificationId', auth, deleteNotification as any)

export { router as notificationRouter  };