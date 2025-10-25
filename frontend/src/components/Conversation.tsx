import React, { useEffect, useState } from 'react';
import clientApi from '@/network/network';
import userProfilePlaceholder from '@/assets/userprofile.svg';
import type { IConversation, IUser } from '@/types';

interface IConversationProps {
    conversation: IConversation;
    currentUser: IUser | null;
    searchedVal: string;
}

const Conversation: React.FC<IConversationProps> = ({ conversation, currentUser, searchedVal }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUser = async (): Promise<void> => {
            if (!currentUser?._id) return;

            const friendId = conversation.members.find((m) => m !== currentUser._id);
            if (!friendId) return;

            try {
                setIsLoading(true);
                const res = await clientApi.get<IUser>(`/users?user_id=${friendId}`);
                if (res) {
                    setUser(res);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        void getUser();
    }, [conversation, currentUser]);

    if (!user) return null;

    if (
        searchedVal &&
        !user.username?.toLowerCase().includes(searchedVal.toLowerCase())
    ) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <div className="relative mr-3">
                <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={user.profilePicture || userProfilePlaceholder}
                    alt={user.username || 'User'}
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                    {user.username || 'Unknown User'}
                </div>
            </div>
        </div>
    );
};

export default Conversation; 