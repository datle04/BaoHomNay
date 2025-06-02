import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ArticleDetail from './pages/ArticleDetail'
import WriteArticle from './pages/WriteArticle'
import LoginPage from './pages/LoginPage'
import ArticleManager from './pages/ArticleManager'
import ArticleForm from './pages/ArticleForm'
import { useSelector } from 'react-redux'

function App() {
  const user = useSelector(state => state.auth)

  useEffect(() => {
    console.log(user);
    
  },[user])
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/write" element={<WriteArticle />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/articles" element={<ArticleManager />} />
        <Route path="/articles/new" element={<ArticleForm />} />
        <Route path="/articles/edit/:id" element={<ArticleForm />} />
      </Routes>
    </>
  )
}

export default App
