import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = '/api/auth'

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}

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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null
      state.token = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
