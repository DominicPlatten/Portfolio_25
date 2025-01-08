import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid login credentials');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <p className="text-white">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-zinc-800 shadow-lg rounded-lg">
        <h2 className="text-3xl font-light text-center text-white">Admin Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm text-zinc-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md shadow-sm p-2 text-white focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-zinc-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md shadow-sm p-2 text-white focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-zinc-900 p-2 rounded-md hover:bg-zinc-100 transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}