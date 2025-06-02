import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  // Nếu đã login thành công, redirect về trang chính (ví dụ /)
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isLogin){
      try {
        dispatch(loginUser({ email, password }));
        toast.success("Đăng nhập thành công!");
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
    } else {
      try {
        dispatch(registerUser({ email, username, password}));
        toast.success("Đăng ký thành công!");
        setIsLogin(prev => !prev)
      } catch (error) {
        toast.error(error);
        console.log(error);        
      }
      
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {
            isLogin ?
            "Đăng nhập"
            :
            "Đăng ký"
          }
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="email@example.com"
            />
          </div>
          {
            !isLogin && (
              <div>
                <label htmlFor="username" className="block mb-1 font-semibold">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>
            )
          }
          
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {
              isLogin ?
                loading ? 'Đang đăng nhập...' : 'Đăng nhập'
                :
                loading ? 'Đang đăng ký...' : 'Đăng ký'
            }
            
          </button>
        </form>

        {
          isLogin ?
          <p 
            className='
                my-4 text-center text-sm
          '>
            Chưa có tài khoản? 
            <span 
              onClick={() => setIsLogin(prev => !prev)}
              className='px-1 font-semibold text-indigo-600 cursor-pointer text-decoration-line: underline hover:text-indigo-700
            '>
              Đăng kí ngay
            </span>
          </p>
          :
          <p 
            className='
                my-4 text-center text-sm
          '>
            Đã có tài khoản? 
            <span
              onClick={() => setIsLogin(prev => !prev)} 
              className='px-1 font-semibold text-indigo-600 cursor-pointer text-decoration-line: underline hover:text-indigo-700
            '>
              Đăng nhập ngay
            </span>
          </p>
        }
      </div>
    </div>
  );
};

export default LoginPage;
