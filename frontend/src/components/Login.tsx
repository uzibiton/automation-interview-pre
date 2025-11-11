import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Login() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = `${AUTH_SERVICE_URL}/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegisterMode ? '/auth/register' : '/auth/login';
      const payload = isRegisterMode ? { email, password, name } : { email, password };

      const response = await axios.post(`${AUTH_SERVICE_URL}${endpoint}`, payload);

      // Store token and redirect
      localStorage.setItem('token', response.data.access_token);
      navigate('/');
      window.location.reload(); // Reload to update App state
    } catch (err: any) {
      setError(
        err.response?.data?.message || (isRegisterMode ? 'Registration failed' : 'Login failed'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Task Manager</h1>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          {isRegisterMode ? 'Create your account' : 'Sign in to manage your tasks'}
        </p>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          {isRegisterMode && (
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                color: 'red',
                marginBottom: '15px',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginBottom: '10px' }}
          >
            {loading ? 'Please wait...' : isRegisterMode ? 'Register' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
            }}
            style={{
              width: '100%',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {isRegisterMode
              ? 'Already have an account? Sign In'
              : "Don't have an account? Register"}
          </button>
        </form>

        {/* Google OAuth - Only show if credentials are configured */}
        {GOOGLE_CLIENT_ID && (
          <>
            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '20px 0',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
              <span style={{ padding: '0 10px', color: '#666', fontSize: '14px' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                background: '#fff',
                color: '#333',
                border: '1px solid #ddd',
              }}
            >
              <span style={{ marginRight: '10px' }}>🔐</span>
              Continue with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
