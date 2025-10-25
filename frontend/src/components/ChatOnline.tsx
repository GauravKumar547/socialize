import React, { useEffect, useState } from 'react';
import clientApi from '@/network/network';
import userProfilePlaceholder from '@/assets/userprofile.svg';
import type { IUser, IOnlineUser, IConversation } from '@/types';

interface IChatOnlineProps {
    onlineUsers: readonly IOnlineUser[];
    currentUserId?: string;
    setCurrentChat: (conversation: IConversation) => void;
    setReceiver: (friend: IUser) => void;
}

const ChatOnline: React.FC<IChatOnlineProps> = ({ onlineUsers, currentUserId, setCurrentChat, setReceiver }) => {
    const [friends, setFriends] = useState<readonly IUser[]>([]);
    const [onlineFriends, setOnlineFriends] = useState<readonly IUser[]>([]);

    useEffect(() => {
        const getFriends = async (): Promise<void> => {
            if (!currentUserId) return;

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
    }, [currentUserId]);

    useEffect(() => {
        const filtered = friends.filter((friend) =>
            onlineUsers.some((ou) => ou.user_id === friend._id)
        );
        setOnlineFriends(filtered);
    }, [friends, onlineUsers]);

    const handleClick = async (user: IUser): Promise<void> => {
        if (!currentUserId) return;

        try {
            const res = await clientApi.get<readonly IConversation[]>(
                `/conversations/${currentUserId}/${user._id}`
            );
            if (res && res.length > 0 && res[0]) {
                setCurrentChat(res[0]);
                setReceiver(user);
            }
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    return (
        <div className="h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Online Friends</h3>

            {onlineFriends.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No friends online</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {onlineFriends.map((friend) => (
                        <div
                            key={friend._id}
                            onClick={() => handleClick(friend)}
                            className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                        >
                            <div className="relative mr-3">
                                <img
                                    className="w-10 h-10 rounded-full object-cover"
                                    src={friend.profilePicture || userProfilePlaceholder}
                                    alt={friend.username}
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="font-medium text-gray-900 truncate block">
                                    {friend.username}
                                </span>
                                <span className="text-xs text-green-600">Online</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatOnline; 