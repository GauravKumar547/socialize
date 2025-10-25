import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import Rightbar from '@/components/Rightbar';
import Feed from '@/components/Feed';
import { AuthContext } from '@/context/AuthContext';
import clientApi from '@/network/network';
import noCoverImg from '@/assets/noCover.png';
import userProfilePlaceholder from '@/assets/userprofile.svg';
import type { IUser } from '@/types';

const Profile: React.FC = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser } = useContext(AuthContext) || {};
    const { username } = useParams<{ username: string }>();

    useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            if (!username) return;

            try {
                setIsLoading(true);
                setError(null);
                const response = await clientApi.get<IUser>(`/users?username=${username}`);
                if (response) {
                    setUser(response);
                } else {
                    setError('User not found');
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to fetch user profile');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchUser();
    }, [username]);

    if (isLoading) {
        return (
            <>
                <Topbar />
                <div className="flex w-full">
                    <div className="flex-[3]">
                        <Sidebar />
                    </div>
                    <div className="flex-[9] p-5">
                        <div className="animate-pulse">
                            <div className="h-80 bg-gray-300 rounded-lg mb-5"></div>
                            <div className="flex items-center mb-5">
                                <div className="w-40 h-40 bg-gray-300 rounded-full mr-5"></div>
                                <div className="flex-1">
                                    <div className="h-8 bg-gray-300 rounded mb-2 w-1/2"></div>
                                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-[3]">
                        <Rightbar />
                    </div>
                </div>
            </>
        );
    }

    if (error || !user) {
        return (
            <>
                <Topbar />
                <div className="flex w-full">
                    <div className="flex-[3]">
                        <Sidebar />
                    </div>
                    <div className="flex-[9] flex items-center justify-center min-h-[500px]">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                {error || 'User not found'}
                            </h2>
                            <p className="text-gray-600">The user profile you're looking for doesn't exist.</p>
                        </div>
                    </div>
                    <div className="flex-[3]">
                        <Rightbar />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar />
            <div className="flex w-full">
                <div className="flex-[3]">
                    <Sidebar />
                </div>
                <div className="flex-[9]">
                    <div className="p-5">
                        <div className="relative">
                            <img
                                src={user.coverPicture || noCoverImg}
                                alt="Cover"
                                className="w-full h-80 object-cover rounded-lg shadow-lg"
                            />
                            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                                <img
                                    src={user.profilePicture || userProfilePlaceholder}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            </div>
                        </div>

                        <div className="mt-20 text-center">
                            <h4 className="text-2xl font-semibold text-gray-800 mb-2">
                                {user.username}
                            </h4>
                            {user.description && (
                                <span className="text-gray-600 text-base block mb-4">
                                    {user.description}
                                </span>
                            )}

                            <div className="flex justify-center space-x-8 mb-6">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-gray-800">
                                        {user.followers?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-gray-800">
                                        {user.following?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Following</div>
                                </div>
                            </div>

                            {currentUser?._id !== user._id && (
                                <div className="flex justify-center space-x-4">
                                    <button className="px-6 py-2 bg-[#1775ee] text-white rounded-md font-medium cursor-pointer hover:bg-[#166fe5] transition-colors duration-200">
                                        Follow
                                    </button>
                                    <button className="px-6 py-2 bg-[#42b72a] text-white rounded-md font-medium cursor-pointer hover:bg-[#36a420] transition-colors duration-200">
                                        Message
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            {username && <Feed username={username} />}
                        </div>
                    </div>
                </div>
                <div className="flex-[3]">
                    <Rightbar user={user} />
                </div>
            </div>
        </>
    );
};

export default Profile; 