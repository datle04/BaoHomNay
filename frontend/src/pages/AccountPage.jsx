import React, { useEffect, useState } from 'react'
import AccountInfo from '../components/AccountInfo';
import LikedArticles from '../components/LikedArticles';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {

  const [activeTab, setActiveTab] = useState('info');
    const user = useSelector(state => state.auth.user)
    const navigate = useNavigate()

    useEffect(() => {
        console.log('User:', user);
        if (!user || Object.keys(user).length === 0) {
            navigate('/login')
        }
    }, [user])

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-100 bg-indigo-600 text-white text-lg flex flex-col shadow-md  ">
        <h1 className="text-2xl font-bold px-8 py-6 border-b border-indigo-500">Tài khoản</h1>
        <nav className="flex flex-col mt-4 font-semibold text-[18px]">
          <button
            className={`px-8 py-6 text-left hover:bg-indigo-500 transition cursor-pointer ${
              activeTab === 'info' ? 'bg-indigo-700 font-semibold' : ''
            }`}
            onClick={() => setActiveTab('info')}
          >
            Thông tin cá nhân
          </button>
          <button
            className={`px-8 py-6 text-left hover:bg-indigo-500 transition cursor-pointer ${
              activeTab === 'liked' ? 'bg-indigo-700 font-semibold' : ''
            }`}
            onClick={() => setActiveTab('liked')}
          >
            Bài báo đã thích
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">
        {activeTab === 'info' && <AccountInfo user={user} />}
        {activeTab === 'liked' && <LikedArticles />}
      </main>
    </div>
  );
};

export default AccountPage
