// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const links = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Thời sự', path: '/thoisu', value: 'thoisu' },
    { label: 'Giáo dục', path: '/giaoduc', value: 'giaoduc'},
    { label: 'Xã hội', path: '/xahoi', value: 'xahoi' },
    { label: 'Khoa học', path: '/khoahoc', value: 'khoahoc' },
    { label: 'Thể thao', path: '/thethao', value: 'thethao' },
    { label: 'Công nghệ', path: '/congnghe', value: 'congnghe' },
    { label: 'Thế giới', path: '/thegioi', value: 'thegioi' },
  ];

  return (
    <nav className="bg-indigo-600 w-full">
      <div className="max-w-screen-xl mx-auto w-full py-2 flex justify-center items-center gap-6 text-white font-medium">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `transition-transform duration-200 ease-in-out transform hover:scale-110 ${
                isActive ? 'underline underline-offset-4' : ''
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
