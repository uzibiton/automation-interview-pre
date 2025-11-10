import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface AuthCallbackProps {
  onLogin: (token: string) => void;
}

function AuthCallback({ onLogin }: AuthCallbackProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      onLogin(token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [searchParams, onLogin, navigate]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p>Authenticating...</p>
    </div>
  );
}

export default AuthCallback;
