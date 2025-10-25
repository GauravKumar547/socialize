import React, { useContext, useEffect, useState } from 'react';
import Post from '@/components/Post';
import Share from '@/components/Share';
import { AuthContext } from '@/context/AuthContext';
import clientApi from '@/network/network';
import type { IPost } from '@/types';

interface IFeedProps {
    username?: string;
}

const Feed: React.FC<IFeedProps> = ({ username }) => {
    const [posts, setPosts] = useState<readonly IPost[]>([]);
    const { user } = useContext(AuthContext);

    const fetchPosts = async (): Promise<void> => {
        try {
            const postsRes = username
                ? await clientApi.get<IPost[]>(`posts/profile/${username}`)
                : await clientApi.get<IPost[]>(`posts/timeline`);

            setPosts(
                postsRes.toSorted((p1: IPost, p2: IPost) => {
                    return new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime();
                })
            );
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };
    useEffect(() => {

        if (user?._id || username) {
            fetchPosts();
        }
    }, [username, user?._id]);

    const removeThePost = (postId: string): void => {
        setPosts(posts.filter((post) => post._id !== postId));
    };
    return (
        <div className={username ? "flex-[5.5] max-w-feed-profile mx-auto" : "flex-[5.5] max-w-feed"}>
            <div className="p-5">
                {(!username || username === user?.username) && <Share onPostSuccessFull={fetchPosts} />}
                {posts.map((post, idx) => (
                    <Post
                        removeThePost={() => removeThePost(post._id)}
                        key={`feedpost-${post._id}-${idx}`}
                        post={post}
                    />
                ))}
            </div>
        </div>
    );
};

export default Feed; 