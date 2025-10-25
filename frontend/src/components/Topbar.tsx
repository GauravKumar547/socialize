import { Search, Settings, Close } from "@mui/icons-material";
import userProfilePlaceholder from "@/assets/userprofile.svg";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import SettingModal from "./SettingModal";
import clientApi from "@/network/network";
import type { IUser } from "@/types";
import CloseFriend from "./CloseFriend";

const Topbar = () => {
    const { user } = useContext(AuthContext);
    const [showSettings, setShowSettings] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [users, setUsers] = useState<IUser[]>([]);

    const searchHandler = async () => {
        if (searchInput.length <= 0) return;
        try {
            const res = await clientApi.get<{ users: IUser[] }>(`/users/search/?q=${searchInput}`);
            setUsers(res.users);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="h-[50px] w-full bg-[#1877f2] flex gap-[5px] items-center sticky top-0 z-[999]">
            <div className="flex-[2.5]">
                <Link to="/" className="text-2xl ml-5 font-bold text-white cursor-pointer no-underline">
                    Socialize
                </Link>
            </div>
            <div className="flex-[5]">
                <div className="w-full h-[30px] bg-white rounded-[30px] flex pr-3 items-center justify-between">
                    <Search className="text-xl ml-[10px]" />
                    <input
                        type="text"
                        onChange={(ev) => {
                            setSearchInput(ev.target.value);
                        }}
                        onKeyUp={searchHandler}
                        placeholder="Search for a user..."
                        value={searchInput}
                        className="flex-1 border-none w-full focus:outline-none"
                    />
                    {searchInput.length > 0 && (
                        <Close
                            onClick={() => {
                                setSearchInput("");
                                setUsers([]);
                            }}
                            className="cursor-pointer"
                        />
                    )}
                </div>
                {searchInput.length > 0 && (
                    <div className="absolute z-[999] py-3 px-3 bg-white rounded-2xl top-[60px] text-gray-500 left-1/2 transform -translate-x-1/2 max-w-[95vw] border border-[#c0c0c0] min-h-fit max-h-[calc(100vh-150px)] overflow-y-auto min-w-[300px]">
                        {users.length > 0 ? (
                            users.map((u) => (
                                <CloseFriend key={u._id} user={u} />
                            ))
                        ) : (
                            <div>No users found</div>
                        )}
                        <div
                            onClick={() => {
                                setSearchInput("");
                                setUsers([]);
                            }}
                            className="w-full bg-[#1877f2] text-white cursor-pointer p-2 box-border rounded-lg"
                        >
                            Close
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-[2.5] flex items-center justify-end pr-8 text-white">
                <div className="flex">
                    <div className="mr-4 cursor-pointer relative">
                        <Settings onClick={() => setShowSettings(true)} />
                    </div>
                </div>
                <Link to={`/profile/${user?.username}`}>
                    <img
                        src={user?.profilePicture ? user.profilePicture : userProfilePlaceholder}
                        alt="profile"
                        className="w-8 h-8 bg-gray-light rounded-full object-cover cursor-pointer"
                    />
                </Link>
            </div>
            {showSettings && user && <SettingModal user={user} onClose={() => setShowSettings(false)} />}
        </div>
    );
};

export default Topbar; 