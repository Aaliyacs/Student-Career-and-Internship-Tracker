import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { InternshipApplication, FilterState } from '../types';

import { apiService } from '../services/api';

interface InternshipState {
  applications: InternshipApplication[];
  filters: FilterState;
  loading: boolean;
  error: string | null;
}

const initialMockApplications: InternshipApplication[] = [
  {
    id: 'app-1',
    companyName: 'Google',
    jobTitle: 'Software Engineering Intern',
    location: 'San Francisco, CA (Hybrid)',
    appliedDate: '2026-05-10',
    status: 'Interview',
    notes: 'Pre-screen test completed. Technical interview scheduled for June 15.',
    salary: '$45/hr',
    contactEmail: 'recruiting@google.com',
    interviewDate: '2026-06-15'
  },
  {
    id: 'app-2',
    companyName: 'Meta',
    jobTitle: 'Frontend Engineer Intern',
    location: 'Remote',
    appliedDate: '2026-05-12',
    status: 'Offer',
    notes: 'Received written offer! $50/hr. Need to decide by June 20.',
    salary: '$50/hr',
    contactEmail: 'careers@meta.com'
  },
  {
    id: 'app-3',
    companyName: 'Netflix',
    jobTitle: 'Full-Stack Developer Intern',
    location: 'Los Gatos, CA',
    appliedDate: '2026-04-20',
    status: 'Rejected',
    notes: 'Rejected after final round. Good feedback, asked to apply next year.',
    contactEmail: 'jobs@netflix.com'
  },
  {
    id: 'app-4',
    companyName: 'Stripe',
    jobTitle: 'Backend Engineer Intern',
    location: 'Seattle, WA',
    appliedDate: '2026-05-22',
    status: 'Screening',
    notes: 'Submitted resume and portfolio. Received coding assessment link.',
    contactEmail: 'university@stripe.com'
  },
  {
    id: 'app-5',
    companyName: 'Microsoft',
    jobTitle: 'Data Science Intern',
    location: 'Redmond, WA',
    appliedDate: '2026-05-25',
    status: 'Applied',
    notes: 'Applied through university portal. Referral from senior developer.',
    contactEmail: 'internships@microsoft.com'
  }
];

const getSavedApplications = (): InternshipApplication[] => {
  const saved = localStorage.getItem('sct_applications');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialMockApplications;
    }
  }
  localStorage.setItem('sct_applications', JSON.stringify(initialMockApplications));
  return initialMockApplications;
};

const initialFilters: FilterState = {
  searchQuery: '',
  status: 'All',
  location: '',
  company: '',
  sortBy: 'appliedDateDesc',
};

const initialState: InternshipState = {
  applications: getSavedApplications(),
  filters: initialFilters,
  loading: false,
  error: null,
};

// Async thunk to submit a new application (integrates with API service)
export const postNewApplication = createAsyncThunk(
  'internships/postNewApplication',
  async (applicationData: Omit<InternshipApplication, 'id'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createInternshipApplication(applicationData);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to submit application to API.');
    }
  }
);

const internshipSlice = createSlice({
  name: 'internships',
  initialState,
  reducers: {
    addApplicationLocal: (state, action: PayloadAction<InternshipApplication>) => {
      state.applications.unshift(action.payload);
      localStorage.setItem('sct_applications', JSON.stringify(state.applications));
    },
    editApplication: (state, action: PayloadAction<InternshipApplication>) => {
      const index = state.applications.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = action.payload;
        localStorage.setItem('sct_applications', JSON.stringify(state.applications));
      }
    },
    deleteApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter(app => app.id !== action.payload);
      localStorage.setItem('sct_applications', JSON.stringify(state.applications));
    },
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
    clearAPIError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postNewApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postNewApplication.fulfilled, (state, action: PayloadAction<InternshipApplication>) => {
        state.loading = false;
        state.applications.unshift(action.payload);
        localStorage.setItem('sct_applications', JSON.stringify(state.applications));
        state.error = null;
      })
      .addCase(postNewApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  addApplicationLocal, 
  editApplication, 
  deleteApplication, 
  setFilters, 
  resetFilters,
  clearAPIError
} = internshipSlice.actions;

export default internshipSlice.reducer;
