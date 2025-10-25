import React, { useContext, useEffect, useRef, useState } from 'react';
import Topbar from '@/components/Topbar';
import Message from '@/components/Message';
import ChatOnline from '@/components/ChatOnline';
import { AuthContext } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import clientApi from '@/network/network';
import type {
    IConversation,
    IMessage,
    IUser,
    ISocketMessage,
    IArrivingMessage
} from '@/types';

const Messenger: React.FC = () => {
    const [conversations, setConversations] = useState<readonly IConversation[]>([]);
    const [currentChat, setCurrentChat] = useState<IConversation | null>(null);
    const [messages, setMessages] = useState<readonly IMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [arrivalMessage, setArrivalMessage] = useState<IArrivingMessage | null>(null);
    const [inputVal, setInputVal] = useState<string>('');
    const [friends, setFriends] = useState<readonly IUser[]>([]);
    const [receiver, setReceiver] = useState<IUser | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { user } = useContext(AuthContext) || {};
    const { socket, onlineUsers } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('getMessage', (data: ISocketMessage) => {
                setArrivalMessage({
                    sender_id: data.sender_id,
                    text: data.text,
                    createdAt: new Date(),
                });
            });
        }
    }, [socket]);

    useEffect(() => {
        const getFriends = async (): Promise<void> => {
            if (!user?._id) return;

            try {
                const res = await clientApi.get<readonly IUser[]>(`/users/friends`);
                if (res) {
                    setFriends(res);
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        void getFriends();
    }, [user]);

    useEffect(() => {
        if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender_id)) {
            const messageToAdd: IMessage = {
                _id: `temp-${Date.now()}`,
                conversationId: currentChat._id,
                sender_id: arrivalMessage.sender_id,
                text: arrivalMessage.text,
                createdAt: arrivalMessage.createdAt.toISOString(),
                updatedAt: arrivalMessage.createdAt.toISOString(),
            };
            setMessages((prev) => [...prev, messageToAdd]);
        }
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        const getConversations = async (): Promise<void> => {
            if (!user?._id) return;

            try {
                const res = await clientApi.get<readonly IConversation[]>(
                    `/conversations/${user._id}`
                );
                if (res) {
                    setConversations(res);
                }
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        void getConversations();
    }, [user]);

    useEffect(() => {
        const getMessages = async (): Promise<void> => {
            if (!currentChat?._id) return;

            try {
                const res = await clientApi.get<readonly IMessage[]>(
                    `/messages/${currentChat._id}`
                );
                if (res) {
                    setMessages(res);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        void getMessages();
    }, [currentChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!newMessage.trim() || !currentChat?._id || !user?._id) return;

        const message = {
            sender: user._id,
            text: newMessage,
            conversation_id: currentChat._id,
        };

        const receiverId = currentChat.members.find((member) => member !== user._id);
        if (receiverId && socket) {
            socket.emit('sendMessage', {
                sender_id: user._id,
                receiver_id: receiverId,
                text: newMessage,
            });
        }

        try {
            const res = await clientApi.post<IMessage>('/messages', message);
            if (res) {
                setMessages((prev) => [...prev, res]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleFriendClick = async (friend: IUser): Promise<void> => {
        if (!user?._id) return;

        // Check if conversation already exists
        const existingConversation = conversations.find((conv) =>
            conv.members.includes(friend._id) && conv.members.includes(user._id)
        );

        if (existingConversation) {
            // Load existing conversation
            setCurrentChat(existingConversation);
            setReceiver(friend);
            setInputVal('');
            return;
        }

        // Create new conversation
        try {
            const res = await clientApi.post<IConversation>('/conversations', {
                receiver_id: friend._id,
            });

            if (res) {
                setConversations((prev) => [...prev, res!]);
                setCurrentChat(res);
                setReceiver(friend);
                setInputVal('');
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    const filteredFriends = friends.filter((friend) =>
        friend.username.toLowerCase().includes(inputVal.toLowerCase())
    );

    return (
        <>
            <Topbar />
            <div className="flex h-screen-minus-topbar">
                <div className="flex-[3.5] border-r border-gray-200">
                    <div className="p-4 bg-white h-full">
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search for friends..."
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1775ee]"
                            />
                        </div>

                        <div className="space-y-2">
                            {filteredFriends.map((friend) => {
                                // Check if there's an existing conversation with this friend
                                const existingConversation = conversations.find((conv) =>
                                    conv.members.includes(friend._id) && conv.members.includes(user?._id || '')
                                );

                                return (
                                    <div
                                        key={friend._id}
                                        onClick={() => handleFriendClick(friend)}
                                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <img
                                            className="w-10 h-10 rounded-full object-cover mr-3"
                                            src={friend.profilePicture || '/assets/userprofile.svg'}
                                            alt={friend.username}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="font-medium text-gray-900 truncate block">
                                                {friend.username}
                                            </span>
                                            {existingConversation && (
                                                <span className="text-xs text-gray-500">
                                                    Conversation exists
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex-[5.5]">
                    {currentChat ? (
                        <div className="h-full flex flex-col">
                            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                                {messages.map((m) => (
                                    <div key={m._id} ref={scrollRef}>
                                        <Message message={m} own={m.sender_id === user?._id} user={m.sender_id === user?._id ? user : receiver} />
                                    </div>
                                )
                                )}
                            </div>

                            <div className="p-4 bg-white border-t border-gray-200">
                                <form onSubmit={handleSubmit} className="flex space-x-3">
                                    <textarea
                                        className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1775ee]"
                                        placeholder="Write something..."
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                        rows={1}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmit(e as any);
                                            }
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-[#1775ee] text-white rounded-lg hover:bg-[#166fe5] focus:outline-none focus:ring-2 focus:ring-[#1775ee] transition-colors"
                                        disabled={!newMessage.trim()}
                                    >
                                        Send
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gray-50">
                            <span className="text-4xl text-gray-400 text-center">
                                Select a friend to start chatting.
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-[3] border-l border-gray-200">
                    <div className="p-4 bg-white h-full">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentUserId={user?._id || ''}
                            setCurrentChat={setCurrentChat}
                            setReceiver={setReceiver}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Messenger; 