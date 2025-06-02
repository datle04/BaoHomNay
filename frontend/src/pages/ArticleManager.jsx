import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles, deleteArticle } from '../features/articles/articleSlice';
import { useNavigate } from 'react-router-dom';

const ArticleManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articles, loading, error } = useSelector((state) => state.articles.list);

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(fetchArticles());
    console.log(articles);
    
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      dispatch(deleteArticle(id));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
        <button
          onClick={() => navigate('/articles/new')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Tạo bài viết mới
        </button>
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Tiêu đề</th>
            <th className="border border-gray-300 p-2 text-left">Tác giả</th>
            <th className="border border-gray-300 p-2 text-left">Ngày tạo</th>
            <th className="border border-gray-300 p-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {articles?.map((article) => (
            <tr key={article._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{article.title}</td>
              <td className="border border-gray-300 p-2">{article.author?.username || 'N/A'}</td>
              <td className="border border-gray-300 p-2">{new Date(article.createdAt).toLocaleDateString()}</td>
              <td className="border border-gray-300 p-2 text-center space-x-2">
                <button
                  onClick={() => navigate(`/articles/edit/${article._id}`)}
                  className="text-indigo-600 hover:underline"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(article._id)}
                  className="text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}

          {articles?.length === 0 && !loading && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                Chưa có bài viết nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleManager;
