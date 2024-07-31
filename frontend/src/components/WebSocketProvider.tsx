import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

const WebSocketContext = createContext<Socket | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketInstance = io('ws://localhost:8081');
        socketInstance.on('message', (message: string) => {
            console.log('received:', message);
        });
        setSocket(socketInstance);
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (context === null) {
        return;
    }
    return context;
};
