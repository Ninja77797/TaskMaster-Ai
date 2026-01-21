import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import GoogleCallback from './pages/GoogleCallback';

function App() {
  const { user } = useAuthStore();

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} 
          />
          <Route
            path="/google-callback"
            element={!user ? <GoogleCallback /> : <Navigate to="/dashboard" />}
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm',
          duration: 4000,
        }}
      />
    </ThemeProvider>
  );
}

export default App;
