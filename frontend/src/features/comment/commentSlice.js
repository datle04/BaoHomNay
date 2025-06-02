import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  comments: [],
}

export const fetchComments = createAsyncThunk('comments/fetch', async articleId => {
  const res = await axios.get(`/api/comments/${articleId}`)
  return res.data
})

export const createComment = createAsyncThunk('comments/create', async ({ articleId, content }, thunkAPI) => {
  const token = thunkAPI.getState().auth.token
  const res = await axios.post(`/api/comments/${articleId}`, { content }, {
    headers: { Authorization: `Bearer ${token}` },  
  })
  return res.data
})

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload)
      })
  },
})

export default commentSlice.reducer
