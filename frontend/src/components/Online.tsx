import React from 'react';
import { Link } from 'react-router-dom';
import userProfilePlaceholder from '@/assets/userprofile.svg';
import type { IUser } from '@/types';

interface IOnlineProps {
    readonly user: IUser;
}

const Online: React.FC<IOnlineProps> = ({ user }) => {
    return (
        <Link to={`/profile/${user.username}`} className="flex cursor-pointer items-center mb-4 no-underline text-black">
            <div className="mr-[10px] relative">
                <img
                    className="w-10 h-10 rounded-full object-cover bg-gray-light"
                    src={user.profilePicture || userProfilePlaceholder}
                    alt={user.username}
                />
                <div className="w-3 h-3 rounded-full bg-green-400 absolute -top-0.5 right-0 border-2 border-white"></div>
            </div>
            <span className="font-medium">
                {user.username}
            </span>
        </Link>
    );
};

export default Online; 