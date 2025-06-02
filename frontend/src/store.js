import { configureStore } from '@reduxjs/toolkit'

import authReducer from './features/auth/authSlice'
import articleReducer from './features/articles/articleSlice'
import categoryReducer from './features/category/categorySlice'
import commentReducer from './features/comment/commentSlice'
import voteReducer from './features/votes/voteSlice'
import userReducer from './features/user/userSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articleReducer,
    categories: categoryReducer,
    comments: commentReducer,
    votes: voteReducer,
    users: userReducer,
  },
})

export default store;