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