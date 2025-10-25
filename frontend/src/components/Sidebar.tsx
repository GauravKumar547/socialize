import {
    RssFeed,
    Chat,
    Menu,
    Group,
} from "@mui/icons-material";
import CloseFriend from "./CloseFriend";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import clientApi from "@/network/network";
import type { IUser } from "@/types";

const Sidebar = () => {
    const { dispatch, user } = useContext(AuthContext);
    const [showMobile, setShowMobile] = useState(false);
    const [friends, setFriends] = useState<readonly IUser[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getFriends = async (): Promise<void> => {
            if (!user?._id) return;

            try {
                const res = await clientApi.get<IUser[]>(`/users/friends`);
                if (res) {
                    setFriends(res);
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        void getFriends();
    }, [user]);

    const handleLogout = () => {
        if (dispatch) {
            dispatch({ type: "LOGOUT" });
        }
        localStorage.removeItem("user");
        setTimeout(() => {
            navigate("/login");
        }, 500);
    };

    return (
        <>
            <div className="relative z-sidebar flex-[2.5] max-w-sidebar">
                <div
                    className={`h-screen-minus-topbar overflow-y-auto sticky top-[50px] max-w-[320px] cursor-pointer bg-white 
                    ${showMobile ? "flex flex-col gap-1 min-w-32 items-start justify-stretch absolute top-0 left-0" : ""}
                    md:block ${!showMobile ? "hidden md:block" : ""}`}
                >
                    <div className="p-5 flex h-[calc(100vh-50px)] flex-col items-stretch justify-between">
                        <div>
                            <ul className="p-0 m-0 list-none">
                                <li className="flex items-center mb-5">
                                    <Link to="/" className="flex items-center no-underline text-black">
                                        <RssFeed className="mr-4" />
                                        <span>Feed</span>
                                    </Link>
                                </li>
                                <li className="flex items-center mb-5">
                                    <Link to="/messenger" className="flex items-center no-underline text-black">
                                        <Chat className="mr-4" />
                                        <span>Chats</span>
                                    </Link>
                                </li>
                                <li className="flex items-center mb-5">
                                    <Link to="/users" className="flex items-center no-underline text-black">
                                        <Group className="mr-4" />
                                        <span>All Users</span>
                                    </Link>
                                </li>
                            </ul>
                            <hr className="my-5" />
                            <ul className="p-0 m-0 list-none">
                                {friends.map((u) => (
                                    <CloseFriend key={u._id} user={u} />
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="py-2 px-4 border border-gray-400 text-[#1775ee] font-bold rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`hidden md:hidden fixed top-14 left-2 text-white z-sidebar
                ${showMobile ? "left-32" : ""}`}
            >
                <Menu
                    className={`rounded-full z-sidebar bg-[#1877f2] p-1 shadow-lg shadow-[#1877f2]
                    ${showMobile ? "bg-[#188ff2]" : ""}`}
                    onClick={() => setShowMobile(!showMobile)}
                />
            </div>
        </>
    );
};

export default Sidebar; 