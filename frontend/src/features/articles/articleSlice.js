import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = '/api/articles'

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
}

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
  const res = await axios.get(API)
  return res.data
})

export const fetchArticleById = createAsyncThunk('articles/fetchById', async id => {
  const res = await axios.get(`${API}/${id}`)
  return res.data
})

export const createArticle = createAsyncThunk('articles/create', async (data, thunkAPI) => {
  const token = thunkAPI.getState().auth.token
  const res = await axios.post(API, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
})

export const updateArticle = createAsyncThunk('articles/update', async ({ id, data }, thunkAPI) => {
  const token = thunkAPI.getState().auth.token
  const res = await axios.put(`${API}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
})

export const deleteArticle = createAsyncThunk('articles/delete', async (id, thunkAPI) => {
  const token = thunkAPI.getState().auth.token
  await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return id
})

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.list = action.payload
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.selected = action.payload
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.list.unshift(action.payload)
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        const index = state.list.findIndex(a => a._id === action.payload._id)
        if (index !== -1) state.list[index] = action.payload
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.list = state.list.filter(a => a._id !== action.payload)
      })
  },
})

export default articleSlice.reducer
