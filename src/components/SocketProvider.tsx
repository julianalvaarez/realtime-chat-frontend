'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { createClient } from '@/lib/supabase/client';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const supabase = createClient();

    useEffect(() => {
        let activeSocket: Socket | null = null;

        const initSocket = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                console.log('No active session for socket');
                return;
            }

            console.log('Initializing socket connection...');
            activeSocket = io('http://localhost:4000', {
                auth: {
                    token: session.access_token
                },
                transports: ['websocket']
            });

            activeSocket.on('connect', () => {
                console.log('Socket connected successfully:', activeSocket?.id);
                setSocket(activeSocket);
            });

            activeSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err.message);
            });

            activeSocket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                setSocket(null);
            });
        };

        initSocket();

        return () => {
            if (activeSocket) {
                console.log('Cleaning up socket connection');
                activeSocket.disconnect();
            }
        }
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
