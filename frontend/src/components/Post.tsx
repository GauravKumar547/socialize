import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVert } from '@mui/icons-material';
import { format } from 'timeago.js';
import { AuthContext } from '@/context/AuthContext';
import clientApi from '@/network/network';
import userProfilePlaceholder from '@/assets/userprofile.svg';
import likeImg from '@/assets/like.png';
import heartImg from '@/assets/heart.png';
import type { IPost, IUser } from '@/types';

interface IPostProps {
    post: IPost;
    removeThePost: () => void;
}

const Post: React.FC<IPostProps> = ({ post, removeThePost }) => {
    const [postUser, setPostUser] = useState<IUser | null>(null);
    const [likes, setLikes] = useState<number>(post.likes.length);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const { user: currentUser } = useContext(AuthContext);
    useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            try {
                if (typeof post.user_id === 'string') {
                    const res = await clientApi.get<IUser>(`users?user_id=${post.user_id}`);
                    setPostUser(res);
                }
                else {
                    setPostUser(post.user_id);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (post.user_id) {
            fetchUser();
        }
    }, [post.user_id]);

    useEffect(() => {
        if (currentUser?._id) {
            setIsLiked(post.likes.includes(currentUser._id));
        }
    }, [currentUser?._id, post.likes]);

    const likeHandler = async (): Promise<void> => {
        if (!currentUser?._id) return;

        try {
            await clientApi.put(`/posts/${post._id}/like`, { user_id: currentUser._id });
            setLikes(isLiked ? likes - 1 : likes + 1);
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const deleteHandler = async (): Promise<void> => {
        if (!currentUser?._id) return;

        try {
            await clientApi.delete(`/posts/${post._id}`, {
                data: { user_id: currentUser._id }
            });
            removeThePost();
            setShowDialog(false);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    if (!postUser) {
        return <div className="w-full rounded-[10px] my-[30px] shadow-card">Loading...</div>;
    }
    return (
        <div className="w-full rounded-[10px] my-[30px] shadow-card">
            <div className="p-[10px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to={`/profile/${postUser.username}`}>
                            <img
                                src={postUser.profilePicture || userProfilePlaceholder}
                                alt={`${postUser.username} profile`}
                                className="w-8 h-8 rounded-full object-cover bg-gray-light"
                            />
                        </Link>
                        <Link to={`/profile/${postUser.username}`} className="no-underline text-black">
                            <span className="text-[15px] font-medium mx-[10px]">{postUser.username}</span>
                        </Link>
                        <span className="text-xs">{format(post.createdAt)}</span>
                    </div>
                    <div className="relative">
                        {currentUser && (currentUser._id === post.user_id || currentUser._id === (post.user_id as IUser)._id) && (<MoreVert
                            onClick={() => setShowDialog(!showDialog)}
                            className="cursor-pointer"
                        />)}
                        {showDialog && (
                            <div className="absolute top-6 right-0 border border-gray-300 border-opacity-50 rounded-[5px] bg-white">
                                <button
                                    onClick={deleteHandler}
                                    className="p-2 hover:cursor-pointer hover:bg-gray-300 hover:bg-opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-5 mb-0">
                    {post.description && <p className="mb-5">{post.description}</p>}
                    {post.image && <img src={post.image} className="w-full max-h-[500px] object-contain mb-5" alt="post content" />}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={likeHandler}
                        >
                            <img
                                src={isLiked ? heartImg : likeImg}
                                alt="like"
                                className="w-6 h-6 mr-[5px] ml-[2px] cursor-pointer"
                            />
                        </button>
                        <span className="text-[15px]">{likes} people like it</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post; 