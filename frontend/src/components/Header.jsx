// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";
import { logout } from '../features/auth/authSlice';
import { BsFillFilePostFill } from "react-icons/bs";

const Header = () => {

  const user = useSelector(state => state.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDropdown, setIsDropdown] = useState(false);

  useEffect(() => {
    console.log(user);
  },[])

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
  <header className="bg-white shadow sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <h1 onClick={() => navigate('/')} className="text-xl font-bold text-indigo-600 cursor-pointer">BÁO HÔM NAY</h1>
      {
        user.user 
        ?
        <div
          onClick={() => setIsDropdown(prev => !prev)} 
          className={`
            relative py-1 px-2 flex items-center gap-2 rounded cursor-pointer ${isDropdown ? "bg-slate-100" : ""}
        `}>
          <FaRegUser />
          <p className="font-semibold">Chào, {user?.user?.username}</p>
          <IoIosArrowDown />
          {
            isDropdown && (
              <div 
                className='
                  absolute top-full w-[90%] bg-gray-200 rounded 
              '>
                <a
                  href="/account"
                  className='flex px-1 py-3 items-center gap-1 font-semibold text-sm border border-t-transparent border-l-transparent border-r-transparent border-b-slate-400 hover:bg-slate-300'
                >
                  <MdInfoOutline  />
                  Thông tin tài khoản
                </a>
                {
                  (user.user.role === "editor" || user.user.role === 'admin') && (
                    <a
                      href="/articles"
                      className='flex px-1 py-3 items-center gap-1 font-semibold text-sm border border-t-transparent border-l-transparent border-r-transparent border-b-slate-400 hover:bg-slate-300'
                    >
                      <BsFillFilePostFill />
                      Quản lý bài đăng
                    </a>
                  )
                }
                <a
                  onClick={() => handleLogout()}
                  className='flex px-2 py-3 items-center gap-1 font-semibold text-sm hover:bg-slate-300'
                >
                  <MdLogout />
                  Đăng xuất
                </a>
              </div>
            )
          }
        </div>
        :
        <div
            
          className="py-1 px-2 flex items-center gap-3 cursor-pointer rounded hover:bg-slate-200 transition-all
        ">
          <FaRegUser />
          <p
            onClick={() => navigate('/login')} 
            className="font-semibold">
              Đăng nhập
            </p>
        </div>
      }
      
    </div>
  </header>
)};


export default Header;
