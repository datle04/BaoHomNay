import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// const API = 'http://localhost:5000/api/articles'
const API = import.meta.env.VITE_BACK_END_URL

const initialState = {
  list: [],
  selected: {},
  loading: false,
  error: null,
}

export const fetchArticles = createAsyncThunk('articles/fetchAll', async (category) => {
  const query = category ? `?category=${category}` : '';
  console.log(API);
  
  const res = await axios.get(`${API}/articles${query}`);
  return res.data;
});

export const fetchArticleByCategory = createAsyncThunk('articles/fetchByCategory', async (category) => {
  const res = await axios.get(`${API}/articles/category/${category}`)
  return res.data
})

export const fetchArticlesByAuthor = createAsyncThunk('articles/fetchByAuthor', async id => {
  const res = await axios.get(`${API}/articles/editor/${id}`)
  return res.data
})

export const fetchArticleById = createAsyncThunk('articles/fetchById', async id => {
  const res = await axios.get(`${API}/articles/${id}`)
  return res.data
})

export const fetchArticleBySlug = createAsyncThunk('articles/fetchBySlug', async slug => {
  const res = await axios.get(`${API}/articles/slug/${slug}`,{
    headers: {
    'Cache-Control': 'no-cache'
  }
  })
  return res.data
})

export const createArticle = createAsyncThunk('articles/create', async (data, thunkAPI) => {
  const token = thunkAPI.getState().auth.token 
  const res = await axios.post(`${API}/articles`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
})

export const updateArticle = createAsyncThunk('articles/update', async ({ id, data }, thunkAPI) => {
  console.log(data);
  
  const token = thunkAPI.getState().auth.token
  const res = await axios.put(`${API}/articles/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
})

export const deleteArticle = createAsyncThunk('articles/delete', async (id, thunkAPI) => {
  const token = thunkAPI.getState().auth.token
  await axios.delete(`${API}/articles/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return id
})

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setSelected: (state) => {
      state.selected = {}
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.list = action.payload.articles || []
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.selected = action.payload
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.selected = action.payload
      })
      .addCase(fetchArticlesByAuthor.fulfilled, (state, action) => {
        state.list = action.payload.articles || []
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.list.unshift(action.payload)
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        console.log(action);
        
        const index = state.list.findIndex(a => a._id === action.payload._id)
        if (index !== -1) state.list[index] = action.payload
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.list = state.list.filter(a => a._id !== action.payload)
      })
  },
})

export default articleSlice.reducer
export const { setSelected } = articleSlice.actions