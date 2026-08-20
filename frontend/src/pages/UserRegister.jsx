import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

function UserRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/user/register', { name, email, password });
      toast.success(response.data.message || 'Registration successful!');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', 'user');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[60px]"></div>
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden z-10 p-6 flex flex-col transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 mb-4 overflow-hidden rounded-md">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1XKMcRFTanevaj90cKvBEwuYo-nKXd0WNQFCiUIERi5tvpLocOHImBsco8Y0ssH3uTqkIamv7TOmxUeNmn-eOF0409tFZnb8PvJ_dNP5Bk88McCaW-ECdc2dJFUpqjUzn7H9B_i8K95x9bpEDWTt5Y-8AA-yYRuPgUJI1mJQaJj2ljyu8z_3wgq8Kr6STwbQO8yahjUbygM2VQSWk6c1h8z4oF_MuzNRPtpWKOt3HeCq_ZWSt7OkiHqHA"
              alt="Food Reels Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-on-surface mb-1 tracking-tight text-center">Get Started</h1>
          <p className="text-sm text-secondary text-center">Create a Viewer Account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider ml-1" htmlFor="name">
              Full Name
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors">
                person
              </span>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-surface-subtle text-on-surface font-body-md text-body-md rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-secondary/50 border border-outline-variant/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors">
                mail
              </span>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-surface-subtle text-on-surface font-body-md text-body-md rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-secondary/50 border border-outline-variant/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider ml-1" htmlFor="password">
              Password
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-12 pr-12 bg-surface-subtle text-on-surface font-body-md text-body-md rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-secondary/50 border border-outline-variant/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface transition-colors focus:outline-none"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full h-12 bg-primary text-white font-semibold rounded-xl shadow-[0px_4px_12px_rgba(226,55,68,0.15)] hover:shadow-[0px_8px_24px_rgba(226,55,68,0.25)] hover:-translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6 w-full opacity-60">
          <div className="h-[1px] bg-slate-300 flex-grow"></div>
          <span className="text-xs font-semibold text-secondary uppercase">Or</span>
          <div className="h-[1px] bg-slate-300 flex-grow"></div>
        </div>

        <button
          className="w-full h-12 bg-white border border-slate-300 text-on-surface font-semibold rounded-xl hover:bg-surface-subtle transition-colors flex items-center justify-center gap-3 cursor-pointer"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-xs text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default UserRegister;