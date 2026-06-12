import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';

// Pages
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Applications from './pages/Applications/Applications';
import AddApplication from './pages/AddApplication/AddApplication';
import LearningProgress from './pages/LearningProgress/LearningProgress';
import Profile from './pages/Profile/Profile';

// Import CSS
import './App.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes (nested inside ProtectedRoute guard and AppLayout shell) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/applications/add" element={<AddApplication />} />
                  <Route path="/applications/edit/:id" element={<AddApplication />} />
                  <Route path="/learning" element={<LearningProgress />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>

              {/* Redirect any other routes to Dashboard (or Login if unauthenticated) */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
