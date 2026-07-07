import express from 'express';
import { type PaginationType, RequestWithUser } from '../types/index.ts';
import { 
    countNotifications, fetchNotificationPagination
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
