import React from 'react';
import { LoginForm } from './components/LoginForm';
import { useAuth } from './hooks/useAuth';

function App() {
  const { login, isAuthenticated } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    console.log('Login attempt starting...');
    try {
      const result = await login(username, password);
      console.log('Login attempt result:', result);
      return result.success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default App;
