import { Server, Socket } from 'socket.io';

let wss: Server;

export const initWebSocket = (server: any) => {
    wss = new Server(server);
    wss.on('connection', (socket: Socket) => {

        socket.on('message', (message) => {
            console.log('received:', message);
        });

        socket.emit('message', 'Socket.IO connection established');
    });
};

export const broadcast = (data: any) => {
    wss.emit(data.event, data.review);
};
