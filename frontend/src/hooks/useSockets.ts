import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4200';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('connect', () => {
            console.log(`connected to socket server: ${socketRef.current?.id}`);
        });

        return () => {
            socketRef.current?.disconnect();
            console.log(
                `disconnected from socket server: ${socketRef.current?.id}`,
            );
            socketRef.current = null;
        };
    }, []);

    return socketRef;
};
