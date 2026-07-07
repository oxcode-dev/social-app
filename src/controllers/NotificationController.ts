import express from 'express';
import { type PaginationType, RequestWithUser } from '../types/index.ts';
import { 
    countNotifications, deleteNotificationById, fetchNotificationPagination,
    markRead,
    readAllNotifications
} from '../services/notificationService.ts';

export const getAllUserNotifications = async (req: RequestWithUser & PaginationType, res: express.Response) => {
    const { page, limit, skip } = req as PaginationType;

    const user =  req.user;

    const totalCount = await countNotifications(user?._id);
    const notifications = await fetchNotificationPagination(user?.id, skip, limit);

    let data = {
        notifications: notifications, 
        status: "success",
        message: "Notifications retrieved successfully",
        metadata: {
            page: page,
            perPage: limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        }
    }

    res.status(200).json(data);
}

export const markNotificationRead = async (req: RequestWithUser, res: express.Response) => {
    const { notificationId } = req.params as { notificationId: string};

    await markRead(notificationId);

    res.status(200).json({
        status: "success",
        message: "Notification marked as read successfully"
    });
}

export const markAllNotificationsRead = async (req: RequestWithUser, res: express.Response) => {
    const user = req.user;

    await readAllNotifications(user?._id);

    res.status(200).json({
        status: "success",
        message: "All notifications marked as read successfully"
    });
}

export const deleteNotification = async (req: RequestWithUser, res: express.Response) => {
    const user = req.user;

    const { notificationId } = req.params as { notificationId: string};

    await deleteNotificationById(notificationId, user?._id);

    res.status(200).json({
        status: "success",
        message: "Notification deleted successfully"
    });
}   