import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

import { apiService } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  const savedUser = localStorage.getItem('sct_user') || sessionStorage.getItem('sct_user');
  const savedAuth = localStorage.getItem('sct_isAuthenticated') || sessionStorage.getItem('sct_isAuthenticated');
  
  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: savedAuth === 'true',
    loading: false,
    error: null,
  };
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, rememberMe }: { email: string; password: string; rememberMe: boolean }, { rejectWithValue }) => {
    try {
      // Mock validation
      if (!email || !password) {
        return rejectWithValue('Email and password are required');
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return rejectWithValue('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        return rejectWithValue('Password must be at least 6 characters');
      }

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Accept credentials for mock auth
      if (email === 'student@example.com' && password === 'password123') {
        const studentProfile = await apiService.getStudentProfile(1);
        
        if (rememberMe) {
          localStorage.setItem('sct_user', JSON.stringify(studentProfile));
          localStorage.setItem('sct_isAuthenticated', 'true');
        } else {
          sessionStorage.setItem('sct_user', JSON.stringify(studentProfile));
          sessionStorage.setItem('sct_isAuthenticated', 'true');
        }
        
        return studentProfile;
      } else {
        return rejectWithValue('Invalid email or password. Use student@example.com / password123');
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'An error occurred during authentication.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('sct_user');
      localStorage.removeItem('sct_isAuthenticated');
      sessionStorage.removeItem('sct_user');
      sessionStorage.removeItem('sct_isAuthenticated');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Save to active storage
        if (localStorage.getItem('sct_user')) {
          localStorage.setItem('sct_user', JSON.stringify(state.user));
        } else {
          sessionStorage.setItem('sct_user', JSON.stringify(state.user));
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;
