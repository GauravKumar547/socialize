import React from 'react';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import Feed from '@/components/Feed';
import Rightbar from '@/components/Rightbar';

const Home: React.FC = () => {
    return (
        <>
            <Topbar />
            <div className="flex justify-between w-full">
                <Sidebar />
                <Feed />
                <Rightbar />
            </div>
        </>
    );
};

export default Home; 