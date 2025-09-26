import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Invalid email');
      return;
    }
    const success = await onLogin(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Incorrect password or login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-card">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Login</h1>
        <p className="text-center text-gray-600 mb-6">Kindly fill in your details below to create an account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-primary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email here"
            />
          </div>
          <div>
            <label className="block text-sm text-primary">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your password here"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-accent">Forgot Password?</a>
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          <button type="submit" className="btn w-full">
            Login
          </button>
          <div className="text-center">or</div>
          <button className="w-full bg-white border border-gray-300 p-2 rounded-md flex items-center justify-center">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" /> Continue with Google
          </button>
          <p className="text-center text-gray-600">
            Don't have an account? <a href="/customer" className="text-accent">Get Started</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;