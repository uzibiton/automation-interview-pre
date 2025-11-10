import React from 'react';

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001';

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${AUTH_SERVICE_URL}/auth/google`;
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Task Manager</h1>
        <p style={{ marginBottom: '30px', color: '#666' }}>Sign in to manage your tasks</p>
        <button
          onClick={handleGoogleLogin}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px' }}
        >
          <span style={{ marginRight: '10px' }}>🔐</span>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
