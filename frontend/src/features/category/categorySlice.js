import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = 'http://localhost:5000/api/articles'

const initialState = {
  category: [
    { label: 'Trang chủ', path: '/' },
    { label: 'Thời sự', path: '/category/thoisu' },
    { label: 'Giáo dục', path: '/category/giaoduc' },
    { label: 'Xã hội', path: '/category/xahoi' },
    { label: 'Khoa học', path: '/category/khoahoc' },
    { label: 'Thể thao', path: '/category/thethao' },
    { label: 'Công nghệ', path: '/category/congnghe' },
    { label: 'Thế giới', path: '/category/thegioi' },
  ],
  selectedCategory: {},
  loading: false,
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
  },
})

export default categorySlice.reducer
