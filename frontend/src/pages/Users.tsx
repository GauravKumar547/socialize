import Rightbar from '@/components/Rightbar'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import clientApi from '@/network/network'
import type { IUser } from '@/types'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import userPlaceholderImg from '@/assets/userprofile.svg';
import { CircularProgress } from '@mui/material'

const Users: React.FC = () => {
    const [allUsers, setAllUsers] = useState<IUser[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const fetchUsers = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const res = await clientApi.get<{ users: IUser[] }>(`/users/all`);
            setAllUsers(res.users);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }
    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <>
            <Topbar />
            <div className="flex justify-between w-full">
                <div className="flex-[3]">
                    <Sidebar />
                </div>
                <div className='flex-[9] flex gap-6 flex-wrap items-center max-h-fit p-5'>
                    {isLoading || allUsers.length == 0 ?
                        <div className='flex-1 flex items-center justify-center text-gray-500 font-semibold h-52'>
                            {isLoading ? <CircularProgress /> : "No user found"}
                        </div>
                        : allUsers.map((user) => (
                            <div
                                key={user._id}
                                className="flex flex-col mb-5 cursor-pointer items-center"
                            >
                                <Link to={`/profile/${user.username}`}>
                                    <img
                                        className="w-[100px] h-[100px] object-cover rounded-[5px]"
                                        src={user.profilePicture || userPlaceholderImg}
                                        alt={user.username}
                                    />
                                    <span className="text-xs">{user.username}</span>
                                </Link>
                            </div>
                        ))
                    }
                </div>
                <div className="flex-[3]">
                    <Rightbar />
                </div>
            </div>
        </>
    )
}

export default Users