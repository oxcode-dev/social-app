import { Socket } from 'socket.io';

const onlineUsers = new Map();

export const SocketServer = (socket: Socket) => {

    socket.on("join", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-message", async (data) => {

        const receiverSocket = onlineUsers.get(data.receiverId);

        if (receiverSocket) {
            socket.to(receiverSocket).emit(
                "receive-message",
                data
            );
        }

    });

    socket.on("disconnect", () => {

        for (const [userId, socketId] of onlineUsers) {

            if (socket.id === socketId) {
                onlineUsers.delete(userId);
            }

        }

    });

};


