import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  votes: {},
  top: [],
  controversial: [],
}

export const vote = createAsyncThunk('votes/vote', async ({ articleId, type }, thunkAPI) => {
  const token = thunkAPI.getState().auth.token
  const res = await axios.post(`/api/votes/${articleId}`, { type }, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return { articleId, vote: res.data }
})

export const fetchTopVoted = createAsyncThunk('votes/top', async () => {
  const res = await axios.get('/api/articles/top-voted')
  return res.data
})

export const fetchControversial = createAsyncThunk('votes/controversial', async () => {
  const res = await axios.get('/api/articles/controversial')
  return res.data
})

const voteSlice = createSlice({
  name: 'votes',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(vote.fulfilled, (state, action) => {
        state.votes[action.payload.articleId] = action.payload.vote
      })
      .addCase(fetchTopVoted.fulfilled, (state, action) => {
        state.top = action.payload
      })
      .addCase(fetchControversial.fulfilled, (state, action) => {
        state.controversial = action.payload
      })
  },
})

export default voteSlice.reducer
