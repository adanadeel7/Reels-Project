import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setName(parsedUser.name || '');
      setEmail(parsedUser.email || '');
    }
    fetchSavedCount();
  }, []);

  const fetchSavedCount = async () => {
    try {
      const response = await api.get('/food/save');
      const savedList = response.data.savedFoods || [];
      setSavedCount(savedList.length);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Name and Email are required');
      return;
    }
    setSaving(true);
    try {
      const response = await api.put('/auth/user/profile', { name, email });
      toast.success(response.data.message || 'Profile updated successfully!');
      
      // Update state & localStorage
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto pb-24 items-center bg-white">
      {/* Header */}
      <div className="w-full mb-6 text-left">
        <h1 className="text-2xl font-bold text-on-surface mb-1">My Profile</h1>
        <p className="text-xs text-slate-500">Manage your user account details and settings.</p>
      </div>

      {/* Edit View */}
      {isEditing ? (
        <form onSubmit={handleUpdateProfile} className="w-full max-w-sm bg-surface-subtle border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4 mt-4">
          <h2 className="text-md font-bold text-on-surface border-b border-slate-200/60 pb-2">Edit Settings</h2>
          
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="edit-name">
              Full Name
            </label>
            <input
              type="text"
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="edit-email">
              Email Address
            </label>
            <input
              type="email"
              id="edit-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>

          <div className="flex gap-2 w-full mt-2">
            <button
              type="button"
              onClick={() => {
                // Reset inputs and close editing
                setName(user?.name || '');
                setEmail(user?.email || '');
                setIsEditing(false);
              }}
              className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer shadow-sm"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-container disabled:opacity-85 cursor-pointer shadow-md flex items-center justify-center gap-1"
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Display View */
        <div className="w-full max-w-sm bg-surface-subtle border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center gap-4 text-center mt-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/20 shadow-inner">
            <span className="material-symbols-outlined text-4xl">account_circle</span>
          </div>

          {/* User Details */}
          <div>
            <h2 className="text-xl font-bold text-on-surface">{user?.name || 'Guest User'}</h2>
            <p className="text-xs text-slate-500">{user?.email || 'guest@example.com'}</p>
          </div>

          <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-semibold uppercase tracking-wider">
            Viewer Account
          </div>

          {/* Separator */}
          <div className="w-full h-[1px] bg-slate-200/60 my-2"></div>

          {/* Stats */}
          <div className="flex justify-around w-full gap-4">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-on-surface">{savedCount}</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Saved Recipes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-on-surface">1.2K</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Likes Given</span>
            </div>
          </div>

          {/* Separator */}
          <div className="w-full h-[1px] bg-slate-200/60 my-2"></div>

          {/* Actions */}
          <div className="flex flex-col gap-2 w-full mt-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-on-surface shadow-sm cursor-pointer transition-colors"
            >
              Edit Profile Settings
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-primary rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
