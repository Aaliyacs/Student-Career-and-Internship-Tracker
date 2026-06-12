import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LearningGoal } from '../types';


interface LearningState {
  goals: LearningGoal[];
  loading: boolean;
  error: string | null;
}

const initialMockGoals: LearningGoal[] = [
  {
    id: 'goal-1',
    courseName: 'React - The Complete Guide (incl. Hooks, React Router, Redux)',
    platform: 'Udemy',
    progressPercentage: 80,
  },
  {
    id: 'goal-2',
    courseName: 'TypeScript Masterclass',
    platform: 'Frontend Masters',
    progressPercentage: 100,
    completionDate: '2026-05-15',
  },
  {
    id: 'goal-3',
    courseName: 'System Design Interview Fundamentals',
    platform: 'Educative',
    progressPercentage: 45,
  },
  {
    id: 'goal-4',
    courseName: 'Data Structures and Algorithms in Python',
    platform: 'Coursera',
    progressPercentage: 100,
    completionDate: '2026-06-01',
  }
];

const getSavedGoals = (): LearningGoal[] => {
  const saved = localStorage.getItem('sct_learning_goals');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialMockGoals;
    }
  }
  localStorage.setItem('sct_learning_goals', JSON.stringify(initialMockGoals));
  return initialMockGoals;
};

const initialState: LearningState = {
  goals: getSavedGoals(),
  loading: false,
  error: null,
};

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<Omit<LearningGoal, 'id'>>) => {
      const newGoal: LearningGoal = {
        ...action.payload,
        id: `goal-${Date.now()}`,
        // If completed (100%), set completion date if not already set
        completionDate: action.payload.progressPercentage === 100 
          ? action.payload.completionDate || new Date().toISOString().split('T')[0] 
          : undefined
      };
      state.goals.unshift(newGoal);
      localStorage.setItem('sct_learning_goals', JSON.stringify(state.goals));
    },
    updateGoal: (state, action: PayloadAction<LearningGoal>) => {
      const index = state.goals.findIndex(goal => goal.id === action.payload.id);
      if (index !== -1) {
        const updatedGoal = {
          ...action.payload,
          completionDate: action.payload.progressPercentage === 100 
            ? action.payload.completionDate || new Date().toISOString().split('T')[0] 
            : undefined
        };
        state.goals[index] = updatedGoal;
        localStorage.setItem('sct_learning_goals', JSON.stringify(state.goals));
      }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(goal => goal.id !== action.payload);
      localStorage.setItem('sct_learning_goals', JSON.stringify(state.goals));
    }
  }
});

export const { addGoal, updateGoal, deleteGoal } = learningSlice.actions;
export default learningSlice.reducer;
