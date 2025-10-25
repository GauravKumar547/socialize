import React, { useContext, useEffect, useState } from 'react';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Online from './Online';
import { AuthContext } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import clientApi from '@/network/network';
import userPlaceholderImg from '@/assets/userprofile.svg';
import type { IUser } from '@/types';

interface IRightbarProps {
    user?: IUser;
}

const Rightbar: React.FC<IRightbarProps> = ({ user }) => {
    const [friends, setFriends] = useState<readonly IUser[]>([]);
    const [onlineFriends, setOnlineFriends] = useState<readonly IUser[]>([]);
    const { user: currentUser } = useContext(AuthContext) || {};
    const { onlineUsers } = useSocket();
    useEffect(() => {
        const getFriends = async (): Promise<void> => {
            try {
                const friendList = await clientApi.get<readonly IUser[]>(`/users/friends${user?._id ? "/?user_id=" + user._id : "/"}`);
                if (friendList) {
                    setFriends(friendList);
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        void getFriends();
    }, [user]);

    useEffect(() => {
        const filtered = friends.filter((friend) =>
            onlineUsers.some((ou) => ou.user_id === friend._id)
        );
        setOnlineFriends(filtered);
    }, [friends, onlineUsers]);
    const HomeRightbar = (): JSX.Element => {
        return (
            <>
                <h4 className="text-lg font-medium mb-[10px]">Online Friends</h4>
                <ul className="m-0 p-0 list-none">
                    {onlineFriends.map((friend) => (
                        <Online key={friend._id} user={friend} />
                    ))}
                </ul>
            </>
        );
    };

    const ProfileRightbar = (): JSX.Element => {
        return (
            <>
                {user?.username !== currentUser?.username && (
                    <button className="mt-[30px] mb-[10px] border-none bg-[#1775ee] text-white rounded-[5px] py-[5px] px-[10px] flex w-[90px] h-[34px] items-center justify-center text-center text-base font-medium cursor-pointer focus:outline-none hover:bg-[#166fe5] transition-colors duration-200">
                        <Add className="mr-1" />
                        Follow
                    </button>
                )}
                <h4 className="text-lg font-medium mb-[10px]">User information</h4>
                <div className="mb-[30px]">
                    <div className="mb-[10px]">
                        <span className="font-medium mr-4 text-[#555]">City:</span>
                        <span className="font-light">
                            {user?.city || 'Not specified'}
                        </span>
                    </div>
                    <div className="mb-[10px]">
                        <span className="font-medium mr-4 text-[#555]">From:</span>
                        <span className="font-light">
                            {user?.from || 'Not specified'}
                        </span>
                    </div>
                    <div className="mb-[10px]">
                        <span className="font-medium mr-4 text-[#555]">Relationship:</span>
                        <span className="font-light">
                            {user?.relationship || 'Not specified'}
                        </span>
                    </div>
                </div>

                <h4 className="text-lg font-medium mb-[10px]">User friends</h4>
                <div className="flex flex-wrap gap-x-5">
                    {friends.slice(0, 6).map((friend) => (
                        <div
                            key={friend._id}
                            className="flex flex-col mb-5 cursor-pointer items-center"
                        >
                            <Link to={`/profile/${friend.username}`}>
                                <img
                                    className="w-[100px] h-[100px] object-cover rounded-[5px]"
                                    src={friend.profilePicture || userPlaceholderImg}
                                    alt={friend.username}
                                />
                                <span className="text-xs">{friend.username}</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className={`${user ? "flex-[3.5] max-w-rightbar-profile" : "flex-[3.5] max-w-rightbar"} hidden md:block`}>
            <div className="py-5 pr-5 pl-0">
                {user ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    );
};

export default Rightbar; 