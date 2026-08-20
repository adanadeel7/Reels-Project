import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

function PartnerRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/food/register', {
        name,
        email,
        password,
        contactName,
        phone,
        address
      });
      toast.success(response.data.message || 'Registration successful!');
      localStorage.setItem('partner', JSON.stringify(response.data.food));
      localStorage.setItem('role', 'partner');
      navigate('/partner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Partner registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface relative overflow-hidden py-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[60px]"></div>
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden z-10 p-6 flex flex-col transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 mb-3 overflow-hidden rounded-md">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1XKMcRFTanevaj90cKvBEwuYo-nKXd0WNQFCiUIERi5tvpLocOHImBsco8Y0ssH3uTqkIamv7TOmxUeNmn-eOF0409tFZnb8PvJ_dNP5Bk88McCaW-ECdc2dJFUpqjUzn7H9B_i8K95x9bpEDWTt5Y-8AA-yYRuPgUJI1mJQaJj2ljyu8z_3wgq8Kr6STwbQO8yahjUbygM2VQSWk6c1h8z4oF_MuzNRPtpWKOt3HeCq_ZWSt7OkiHqHA"
              alt="Food Reels Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-1 tracking-tight text-center">Partner Sign Up</h1>
          <p className="text-xs text-secondary text-center font-semibold">Join as a Restaurant or Chef</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          {/* Restaurant Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-secondary uppercase tracking-wider ml-1" htmlFor="name">
              Restaurant / Brand Name
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors text-[20px]">
                restaurant
              </span>
              <input
                type="text"
                id="name"
                placeholder="Chef Alfredo's Bistro"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-surface-subtle text-on-surface font-body-md text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-secondary/50 border border-outline-variant/30"
              />
            </div>
          </div>

          {/* Contact Person */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-secondary uppercase tracking-wider ml-1" htmlFor="contactName">
              Contact Person Name
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors text-[20px]">
                person
              </span>
              <input
                type="text"
                id="contactName"
                placeholder="Alfredo Mancini"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-surface-subtle text-on-surface font-body-md text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-secondary/50 border border-outline-variant/30"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-secondary uppercase tracking-wider ml-1" htmlFor="phone">
              Contact Phone Number
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors text-[20px]">
                call
              </span>
              <input
                type="tel"
                id="phone"
                placeholder="555-0199"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-surface-subtle text-on-surface font-body-md text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-secondary/50 border border-outline-variant/30"
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-secondary uppercase tracking-wider ml-1" htmlFor="address">
              Restaurant Address
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors text-[20px]">
                pin_drop
              </span>
              <input
                type="text"
                id="address"
                placeholder="123 Gourmet St, Foodville"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-surface-subtle text-on-surface font-body-md text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-secondary/50 border border-outline-variant/30"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-secondary uppercase tracking-wider ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors text-[20px]">
                mail
              </span>
              <input
                type="email"
                id="email"
                placeholder="partner@restaurant.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-surface-subtle text-on-surface font-body-md text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-secondary/50 border border-outline-variant/30"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-secondary uppercase tracking-wider ml-1" htmlFor="password">
              Password
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors text-[20px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-11 pr-11 bg-surface-subtle text-on-surface font-body-md text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-secondary/50 border border-outline-variant/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface transition-colors focus:outline-none"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full h-11 bg-primary text-white font-semibold rounded-xl shadow-[0px_4px_12px_rgba(226,55,68,0.15)] hover:shadow-[0px_8px_24px_rgba(226,55,68,0.25)] hover:-translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                <span>Applying...</span>
              </>
            ) : (
              <>
                <span>Submit Application</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle link */}
        <div className="mt-4 text-center">
          <p className="text-xs text-secondary">
            Already have a partner account?{' '}
            <Link to="/partner/login" className="text-primary font-bold hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default PartnerRegister;