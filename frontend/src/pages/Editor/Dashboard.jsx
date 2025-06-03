// src/pages/Editor/Dashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticlesByAuthor } from '../../features/articles/articleSlice'; // Giả sử bạn đã có API fetch bài viết của tác giả
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const articles = useSelector(state => state.articles.list)
  const loading = useSelector(state => state.articles.loading)
  const error = useSelector(state => state.articles.error)
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchArticlesByAuthor(user._id)); // API lấy bài viết của editor
    }
  }, [dispatch, user]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý bài viết của bạn</h1>
      <Link to="/editor/create" className="mb-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded">
        Tạo bài viết mới
      </Link>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Tiêu đề</th>
            <th className="border border-gray-300 p-2">Trạng thái</th>
            <th className="border border-gray-300 p-2">Ngày tạo</th>
            <th className="border border-gray-300 p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {articles.length === 0 ? (
            <tr><td colSpan="4" className="p-4 text-center">Bạn chưa có bài viết nào</td></tr>
          ) : (
            articles.map(article => (
              <tr key={article._id}>
                <td className="border border-gray-300 p-2">{article.title}</td>
                <td className="border border-gray-300 p-2">
                  {article.published ? 'Đã đăng' : 'Chờ duyệt'}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(article.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">
                  <Link to={`/editor/edit/${article._id}`} className="text-indigo-600 hover:underline">Sửa</Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
