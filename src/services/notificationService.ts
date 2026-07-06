import { Notification } from "../models/notification.ts";
import { NotificationType } from "../types/index.ts";


export const createNotification = async({

    io,

    recipient,

    sender,

    type,

    post=null,

    comment=null,

    message=null

}: NotificationType) =>{

    if(recipient.toString()===sender.toString()){
        return;
    }

    const notification = await Notification.create({
        recipient,
        sender,
        type,
        post,
        comment,
        message
    });

    const populated = await Notification.findById(notification._id)
        .populate("sender","username profilePic");

    io.to(recipient.toString())
        .emit("notification", populated);

};