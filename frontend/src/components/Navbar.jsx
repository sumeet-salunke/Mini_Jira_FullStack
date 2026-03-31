import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const Navbar = () => {
  const authenticated = isAuthenticated();

  return (
    <nav className="navbar-front">
      <Link to="/" className="sidebar-logo" style={{ padding: 0 }}>
        Mini <span style={{ color: 'var(--text-primary)' }}>Jira</span>
      </Link>
      <div className="nav-front-links">
        <Link to="/" className="nav-front-link">Home</Link>
        <a href="#features" className="nav-front-link">Features</a>
        {authenticated ? (
          <Link to="/dashboard" className="btn-primary">Dashboard</Link>
        ) : (
          <>
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
