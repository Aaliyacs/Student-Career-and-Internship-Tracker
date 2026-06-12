import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import internshipReducer from './internshipSlice';
import learningReducer from './learningSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    internships: internshipReducer,
    learning: learningReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
