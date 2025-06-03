import React from 'react'

const AccountInfo = ({ user }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Thông tin tài khoản</h2>
      {/* Nội dung như trước */}
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-indigo-600">
          {user.avatar ? (
            <img src={user.avatar} alt="User Avatar" className="object-cover w-full h-full" />
          ) : (
            <div className="flex justify-center items-center bg-gray-200 w-full h-full text-indigo-600 text-6xl font-bold">
              {user.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="w-full space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Tên người dùng</label>
            <p className="mt-1 text-lg">{user.username || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <p className="mt-1 text-lg">{user.email || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Vai trò</label>
            <p className="mt-1 text-lg capitalize">{user.role || 'client'}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Ngày tạo tài khoản</label>
            <p className="mt-1 text-lg">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Chưa cập nhật'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AccountInfo
