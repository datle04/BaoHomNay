import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import ArticleDetail from './pages/ArticleDetail'
import WriteArticle from './pages/WriteArticle'
import LoginPage from './pages/LoginPage'
import ArticleManager from './pages/ArticleManager'
import ArticleForm from './pages/ArticleForm'
import { useSelector } from 'react-redux'
import Dashboard from './pages/Editor/Dashboard'
import MainLayout from './layouts/MainLayout'
import AccountPage from './pages/AccountPage'
import SubLayout from './layouts/SubLayout'
import PrivateRoute from './components/PrivateRoute'

function App() {
  const user = useSelector(state => state.auth)
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        {/* Layout chính cho người dùng */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/:category"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/article/:slug"
          element={
            <MainLayout>
              <ArticleDetail/>
            </MainLayout>
          }
        />
        <Route
          path="/account/"
          element={
            <PrivateRoute>
              <SubLayout>
                <AccountPage/>
              </SubLayout>
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/articles" element={<PrivateRoute><SubLayout><ArticleManager /></SubLayout></PrivateRoute>} />
        <Route path="/articles/new" element={<PrivateRoute><ArticleForm /></PrivateRoute>} />
        <Route path="/articles/edit/:id" element={<PrivateRoute><ArticleForm /></PrivateRoute>} />
      </Routes>
    </>
  )
}

export default App
