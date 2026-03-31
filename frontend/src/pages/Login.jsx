import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/axiosInstance';
import { persistAuth } from '../utils/auth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    if (!payload.email || !payload.password) {
      setError('Enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', payload);
      persistAuth(data);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-shell">
        <section className="auth-showcase glass-card">
          <span className="auth-eyebrow">Team workspace</span>
          <h1>Log in and get back to delivery.</h1>
          <p>
            Track project health, move tasks across the board, and keep discussions tied to the work.
          </p>
          <div className="auth-highlights">
            <div>
              <strong>Projects</strong>
              <span>Organized by owner and progress</span>
            </div>
            <div>
              <strong>Tasks</strong>
              <span>Priorities, due dates, and status flow</span>
            </div>
            <div>
              <strong>Comments</strong>
              <span>Conversation stays attached to tasks</span>
            </div>
          </div>
        </section>

        <section className="glass-card auth-form-card">
          <div className="auth-form-header">
            <span className="auth-badge">Sign in</span>
            <h2>Welcome back</h2>
            <p>Use the same credentials you registered with.</p>
          </div>

          {error && <div className="form-alert form-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form-grid">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                autoComplete="email"
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
