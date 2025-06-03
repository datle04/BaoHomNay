import React from 'react'
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => (
  <Link to={`/article/${article.slug}`} className="block">
    <img src={article.thumbnail} alt={article.title} className="rounded w-full h-48 object-cover" />
    <h2 className="text-lg font-semibold mt-2">{article.title}</h2>
    <p className="text-sm text-gray-600">{article.summary}</p>
  </Link>
);


export default ArticleCard
