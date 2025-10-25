import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import type { IOnlineUser } from '@/types';
import { SOCKET_URL } from '@/utils/constants';

interface ISocketContextValue {
    readonly socket: Socket | null;
    readonly onlineUsers: readonly IOnlineUser[];
    readonly isConnected: boolean;
}

const SocketContext = createContext<ISocketContextValue | null>(null);

export const useSocket = (): ISocketContextValue => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

interface ISocketProviderProps {
    readonly children: React.ReactNode;
}

export const SocketProvider: React.FC<ISocketProviderProps> = ({ children }) => {
    const socket = useRef<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<readonly IOnlineUser[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const { user } = useContext(AuthContext) || {};

    useEffect(() => {
        if (!socket.current) {
            socket.current = io(SOCKET_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                path: '/socket.io',
                autoConnect: true,
            });

            socket.current.on('connect', () => {
                setIsConnected(true);
            });

            socket.current.on('disconnect', () => {
                setIsConnected(false);
            });

            socket.current.on('getUsers', (users: readonly IOnlineUser[]) => {
                setOnlineUsers(users);
            });
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (user?._id && socket.current) {
            socket.current.emit('addUser', user._id);
        }
    }, [user]);

    const value: ISocketContextValue = {
        socket: socket.current,
        onlineUsers,
        isConnected,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}; 