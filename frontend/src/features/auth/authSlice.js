import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = 'http://localhost:5000/api/auth'

const userFromStorage = localStorage.getItem('user');
const tokenFromStorage = localStorage.getItem('token');

const initialState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: tokenFromStorage || null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/login`, credentials)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const registerUser = createAsyncThunk('auth/registerUser', async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/register`, data)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const voteArticle = createAsyncThunk(
  'auth/voteArticle',
  async ({ articleId, type }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      const res = await axios.post(
        `http://localhost:5000/api/articles/${articleId}/vote`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        articleId,
        type,
        updatedUser: res.data.updatedUser, // bạn cần trả về `updatedUser` từ backend
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Vote failed');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token

        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(voteArticle.fulfilled, (state, action) => {
        const { updatedUser } = action.payload;

        // Cập nhật chỉ upvotedArticles của user
        state.user.upvotedArticles = updatedUser.upvotedArticles;

        // Đồng bộ localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          storedUser.upvotedArticles = updatedUser.upvotedArticles;
          localStorage.setItem('user', JSON.stringify(storedUser));
        }
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
