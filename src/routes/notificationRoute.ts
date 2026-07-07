// GET    /api/notifications
// PATCH  /api/notifications/:notificationId/read
// PATCH  /api/notifications/read-all
// DELETE /api/notifications/:notificationId

import express from 'express';
import { auth } from '../middlewares/authMiddleware.ts';
import { getAllUserNotifications } from '../controllers/NotificationController.ts';

const router = express.Router();

router.get('/', auth, getAllUserNotifications as any);

export { router as notificationRouter  };