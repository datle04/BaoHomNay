import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = '/api/categories'

const initialState = {
  list: [],
  loading: false,
}

export const fetchCategories = createAsyncThunk('categories/fetch', async () => {
  const res = await axios.get(API)
  return res.data
})

export const createCategory = createAsyncThunk('categories/create', async (data, thunkAPI) => {
  const token = thunkAPI.getState().auth.token
  const res = await axios.post(API, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
})

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.list = action.payload
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
  },
})

export default categorySlice.reducer
