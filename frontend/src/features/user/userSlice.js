import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = '/api/users'

const initialState = {
  list: [],
}

export const fetchUsers = createAsyncThunk('users/fetch', async (_, thunkAPI) => {
  const token = thunkAPI.getState().auth.token
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
})

export const deleteUser = createAsyncThunk('users/delete', async (id, thunkAPI) => {
  const token = thunkAPI.getState().auth.token
  await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return id
})

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter(user => user._id !== action.payload)
      })
  },
})

export default userSlice.reducer
