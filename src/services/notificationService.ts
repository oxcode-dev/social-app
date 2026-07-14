import { Notification } from "../models/notification.ts";
import { type NotificationType } from "../types/index.ts";


export const createNotification = async({
    io=true,
    recipient,
    sender,
    type,
    post = null,
    comment = null,
    chat = null,
    message = null
}: NotificationType) =>{

    if(recipient === sender){
        return;
    }

    const notification = await Notification.create({
        recipient,
        sender,
        type,
        post,
        comment,
        chat,
        message,
    });

    const populated = await Notification.findById(notification._id)
        .populate("sender","username profilePic");

    // io.to(recipient.toString())
    //     .emit("notification", populated);

};

export const countNotifications = async (userId: string) => {
    return await Notification.countDocuments({recipient: userId });
}

export const fetchNotificationPagination = async (userId: string, skip: number, limit: number) => {
    return await Notification.find({ 
            recipient: userId
        })
        .populate("sender", "username id first_name last_name")
        .populate("post")
        .populate("chat")
        .populate("comment")
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit)
}

export const markRead = async(notificationId: string)=>{

    await Notification.findByIdAndUpdate(
        notificationId,
        {
            isRead:true
        }

    );
};

export const readAllNotifications = async(userId: string)=>{
    await Notification.updateMany(
        {
            recipient:userId,
            isRead:false
        },
        {
            isRead:true
        }
    );
};

export const deleteNotificationById = async(notificationId: string, userId: string)=>{

    await Notification.findOneAndDelete({

        _id: notificationId,

        recipient: userId

    });
};

export const deleteNotificationsByUserId = async(userId: string) => {
    await Notification.deleteMany({
        $or: [
            { sender: userId },
            { recipient: userId }
        ]
    });
}