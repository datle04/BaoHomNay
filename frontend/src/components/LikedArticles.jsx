import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ArticleCard from '../components/ArticleCard'
import { Link } from 'react-router-dom';
const LikedArticles = () => {

    const token = useSelector(state => state.auth.token)
    const API = import.meta.env.VITE_BACK_END_URL
    const [articles, setArticles] = useState([]);
    const articleIds = useSelector((state) => state.auth.user?.upvotedArticles || []);

    useEffect(() => {
        const fetchLikedArticles = async () => {
        try {
            if (articleIds.length === 0) return;

            const res = await axios.post(
            `${API}/articles/liked`,
            { articleIds },
            { headers: { Authorization: `Bearer ${token}` } }
            );

            setArticles(res.data.articles);
        } catch (error) {
            console.error('Lỗi khi fetch bài viết đã thích:', error);
        }
        };

        fetchLikedArticles();
    }, [articleIds, token]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Bài báo đã thích</h2>
      {articles.length === 0 ? (
        <p className="text-center text-gray-500">Bạn chưa thích bài báo nào.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article._id} className="bg-white rounded shadow p-4">
              <img src={article.thumbnail} alt={article.title} className="h-40 w-full object-cover rounded" />
              <h3 className="text-lg font-semibold mt-2">{article.title}</h3>
              <p className="text-sm text-gray-600">{article.summary}</p>
              <Link to={`/article/${article.slug}`} className="text-indigo-600 mt-2 inline-block">
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default LikedArticles
