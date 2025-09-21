import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/solid';

const LoginPage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onLogin(password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password. Try "admin123" (5 attempts max).');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary to-white">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="flex justify-center mb-6">
          <LockClosedIcon className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center text-primary mb-4">Admin Login</h1>
        <p className="text-center text-muted mb-6 text-sm">Secure access to the admin dashboard.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Enter password"
              autoComplete="off"
            />
          </div>
          {error && <p className="text-error text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-accent text-white py-2.5 rounded-lg hover:bg-indigo-600 transition-colors duration-200"
          >
            Sign In
          </button>
          <p className="text-center text-muted text-sm mt-4">
            Not an admin? <a href="/customer" className="text-accent hover:underline">Customer Portal</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;