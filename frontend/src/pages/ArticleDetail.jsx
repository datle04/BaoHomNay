// src/pages/ArticleDetail.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchArticleById, fetchArticleBySlug } from '../features/articles/articleSlice';
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import axios from 'axios';
import { voteArticle } from '../features/auth/authSlice';

const ArticleDetail = () => {

  const API = 'http://localhost:5000/api'

  const user = useSelector(state => state.auth)
  const upvotedArticles = useSelector(state => state.auth.user.upvotedArticles)
  const downvotedArticles = useSelector(state => state.auth.user.downvotedArticles)
  const { slug } = useParams();
  const selected = useSelector(state => state.articles.selected)
  const dispatch = useDispatch();
  const [vote, setVote] = useState(null);
  const [votes, setVotes] = useState({ up: 0, down: 0 });
  
  useEffect(() => {
    dispatch(fetchArticleBySlug(slug));
    console.log(user);
  },[slug])

  useEffect(() => {
    if (!selected?._id) return;

    // Kiểm tra xem user đã upvote bài này chưa
    if (upvotedArticles.some(aid => aid === selected._id)) {
      setVote('up');
    } else if (downvotedArticles.some(aid => aid === selected._id)) {
      setVote('down');
    } else {
      setVote(null);
    }

    // Cập nhật số lượt vote hiển thị
    setVotes({
      up: selected.votes.up.length,
      down: selected.votes.down.length,
    });
  }, [selected, upvotedArticles, downvotedArticles]);

const handleVote = async (type) => {
  try {
    await dispatch(voteArticle({ articleId: selected._id, type }));
    setVote(type); // local UI update
  } catch (err) {
    console.error(err);
  }
};


  if (!selected) return <p>Đang tải...</p>;

  return (
    <>
    <div className="container max-w-[65%] mx-auto p-6 text-lg">
      <h2 className="text-3xl font-bold mb-2">{selected?.title}</h2>
      <p className="text-sm text-gray-600 mb-4">Tác giả: {selected?.author?.username}</p>
      <div className="prose text-lg leading-loose" dangerouslySetInnerHTML={{ __html: selected?.content }} />
      <div className="flex gap-4 px-5 py-2 w-fit items-center">
        <button
          className={`
            h-12 px-4 flex items-center justify-center border rounded-full transition-all cursor-pointer 
            ${vote === 'up' ? 'bg-blue-500 text-white' : 'border-slate-400 hover:scale-115'}
          `}
          onClick={() => handleVote('up')}
        >
          <BiLike />
        </button>
        <button
          className={`
            h-12 px-4 flex items-center justify-center border rounded-full transition-all cursor-pointer
            ${vote === 'down' ? 'bg-red-500 text-white' : 'border-slate-400 hover:scale-115'}
          `}
          onClick={() => handleVote('down')}
        >
          <BiDislike />
        </button>
      </div>
    </div>
    </>
  );
};

export default ArticleDetail;
