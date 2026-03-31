import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import { isAuthenticated } from './utils/auth';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  return isAuthenticated() ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

const PublicOnlyRoute = ({ children }) => (
  isAuthenticated() ? <Navigate to="/dashboard" replace /> : children
);

function App() {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="app-container">
      {!authenticated && isLandingPage ? <Navbar /> : null}
      {authenticated ? <Sidebar /> : null}
      
      <main className={authenticated ? 'main-content animate-fade-in' : 'public-main'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />
          <Route path="/register" element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/projects" element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          } />
          <Route path="/projects/:id" element={
            <PrivateRoute>
              <ProjectDetails />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
