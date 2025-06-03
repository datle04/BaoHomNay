// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchArticles } from '../features/articles/articleSlice';
import { fetchArticleByCategory } from '../features/articles/articleSlice';

const HomePage = () => {

  const { category } = useParams();

  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const articles = useSelector(state => state.articles.list)
  const loading = useSelector(state => state.articles.loading)
  const error = useSelector(state => state.articles.error)

  useEffect(() => {
    dispatch(fetchArticles(category));
    console.log(articles);
  }, [dispatch, category]);

   const featured = articles.length ? articles[0] : null;

  return (
    <div>
      <HeroSection featuredArticle={featured} />
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-bold mb-4">Bài viết mới nhất</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.slice(1).map((article) => (
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
      </div>
    </div>
  );
};

export default HomePage;
