import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { persistAuth } from '../utils/auth';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    if (!payload.name || !payload.email || !payload.password) {
      setError('Complete all required fields.');
      return;
    }

    if (payload.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (payload.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      persistAuth(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-shell">
        <section className="auth-showcase glass-card auth-showcase-register">
          <span className="auth-eyebrow">New workspace</span>
          <h1>Create your account and start organizing work.</h1>
          <p>
            Set up projects, track priorities, and keep the team aligned from a single board.
          </p>
          <ul className="auth-points">
            <li>Fast project creation</li>
            <li>Simple task status flow</li>
            <li>Comments attached to execution</li>
          </ul>
        </section>

        <section className="glass-card auth-form-card">
          <div className="auth-form-header">
            <span className="auth-badge">Register</span>
            <h2>Create account</h2>
            <p>Use a work email and a password you can remember.</p>
          </div>

          {error && <div className="form-alert form-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                autoComplete="name"
                placeholder="Your full name"
                required
              />
            </div>
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
            <div className="auth-field-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Register;
