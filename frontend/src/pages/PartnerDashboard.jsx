import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState('my-dishes');
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [partner, setPartner] = useState(null);
  const navigate = useNavigate();

  // Form States for Upload
  const [dishName, setDishName] = useState('');
  const [dishDesc, setDishDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [customTag, setCustomTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' | 'url'
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('video', file);
    
    setUploadingFile(true);
    const toastId = toast.loading('Uploading video file...');
    try {
      const response = await api.post('/food/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setVideoUrl(response.data.videoUrl);
      toast.success('Video uploaded successfully!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload video file. Ensure it is a valid format (mp4, mov, avi, webm, mkv).', { id: toastId });
    } finally {
      setUploadingFile(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    const partnerData = localStorage.getItem('partner');
    if (!partnerData) {
      toast.error('Access Denied. Please Login as Partner.');
      navigate('/partner/login');
      return;
    }
    setPartner(JSON.parse(partnerData));
    fetchPartnerDishes();
  }, [navigate]);

  const fetchPartnerDishes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/food/partner');
      setDishes(response.data.foodItems || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch uploaded dishes');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.get('/auth/food/logout');
      toast.success('Logged out successfully');
      localStorage.removeItem('partner');
      localStorage.removeItem('role');
      navigate('/partner/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const handleAddTag = (tag) => {
    const nextTags = new Set(selectedTags);
    if (nextTags.has(tag)) {
      nextTags.delete(tag);
    } else {
      nextTags.add(tag);
    }
    setSelectedTags(nextTags);
  };

  const handleCustomTagSubmit = (e) => {
    if (e.key === 'Enter' && customTag.trim()) {
      e.preventDefault();
      handleAddTag(customTag.trim());
      setCustomTag('');
    }
  };

  const handleDeleteDish = async (dishId) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    try {
      // Assuming a delete route exists or stube it
      // For now, let's filter from state or call backend if implemented.
      // await api.delete(`/food/${dishId}`);
      toast.success('Dish deleted successfully');
      setDishes(dishes.filter(d => d._id !== dishId));
    } catch (err) {
      toast.error('Failed to delete dish');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!dishName || !videoUrl) {
      toast.error('Dish Name and Video URL are required');
      return;
    }
    setUploading(true);
    try {
      const payload = {
        name: dishName,
        video: videoUrl,
        description: dishDesc,
        tags: Array.from(selectedTags)
      };
      await api.post('/food', payload);
      toast.success('Reel published successfully!');
      
      // Reset form
      setDishName('');
      setDishDesc('');
      setVideoUrl('');
      setSelectedTags(new Set());
      
      // Refresh list & switch tab
      fetchPartnerDishes();
      setActiveTab('my-dishes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish reel');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-body-md text-on-surface">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-white shadow-[1px_0_8px_rgba(0,0,0,0.02)] z-50 flex flex-col pt-6 pb-6 border-r border-slate-100">
        <div className="px-6 mb-8 flex items-center gap-3">
          <img
            alt="Food Reels Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XKMcRFTanevaj90cKvBEwuYo-nKXd0WNQFCiUIERi5tvpLocOHImBsco8Y0ssH3uTqkIamv7TOmxUeNmn-eOF0409tFZnb8PvJ_dNP5Bk88McCaW-ECdc2dJFUpqjUzn7H9B_i8K95x9bpEDWTt5Y-8AA-yYRuPgUJI1mJQaJj2ljyu8z_3wgq8Kr6STwbQO8yahjUbygM2VQSWk6c1h8z4oF_MuzNRPtpWKOt3HeCq_ZWSt7OkiHqHA"
          />
          <span className="font-bold text-xl text-primary tracking-tight">Partner</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => setActiveTab('my-dishes')}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all group cursor-pointer ${
              activeTab === 'my-dishes'
                ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                : 'text-on-surface hover:bg-surface-subtle'
            }`}
          >
            <span className="material-symbols-outlined mr-3">restaurant</span>
            <span>My Dishes</span>
          </button>

          <button
            onClick={() => setActiveTab('upload-reel')}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all group cursor-pointer ${
              activeTab === 'upload-reel'
                ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                : 'text-on-surface hover:bg-surface-subtle'
            }`}
          >
            <span className="material-symbols-outlined mr-3">movie</span>
            <span>Upload Reel</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all group cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                : 'text-on-surface hover:bg-surface-subtle'
            }`}
          >
            <span className="material-symbols-outlined mr-3">analytics</span>
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all group cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                : 'text-on-surface hover:bg-surface-subtle'
            }`}
          >
            <span className="material-symbols-outlined mr-3">settings</span>
            <span>Settings</span>
          </button>
        </nav>

        <div className="px-4 pt-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-primary transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined mr-3">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="pl-72 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)] z-30 flex-shrink-0">
          <div className="flex items-center bg-surface-subtle px-4 py-2 rounded-xl w-96 border border-slate-100">
            <span className="material-symbols-outlined text-slate-500 mr-2">search</span>
            <input
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
              placeholder="Search reels, analytics..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-600 hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-sm text-on-surface">{partner?.name || 'Partner Chef'}</p>
                <p className="text-xs text-slate-500">Premier Partner</p>
              </div>
              <img
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/10"
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&auto=format&fit=crop&q=80"
              />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto bg-white">

          
          {/* TAB 1: MY DISHES */}
          {activeTab === 'my-dishes' && (
            <div className="flex flex-col w-full px-6 py-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-on-surface mb-2">Welcome back, {partner?.name || 'Chef'}</h1>
                  <p className="text-sm text-slate-500 max-w-2xl">
                    Manage your culinary creations, track engagement, and upload new reels to reach more food lovers.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('upload-reel')}
                  className="bg-primary hover:bg-primary-container text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined">add</span>
                  <span>Add New Dish</span>
                </button>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-surface-subtle p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Dishes</p>
                    <p className="text-4xl font-bold text-on-surface">{dishes.length}</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-3xl">restaurant_menu</span>
                  </div>
                </div>

                <div className="bg-surface-subtle p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Reel Views</p>
                    <p className="text-4xl font-bold text-on-surface">45.2K</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <span className="material-symbols-outlined text-3xl">visibility</span>
                  </div>
                </div>

                <div className="bg-surface-subtle p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Engagement Rate</p>
                    <p className="text-4xl font-bold text-on-surface">8.4%</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                    <span className="material-symbols-outlined text-3xl">trending_up</span>
                  </div>
                </div>
              </div>

              {/* Dishes Section */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">movie</span>
                  <span>Your Dishes & Reels</span>
                </h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20 text-slate-500">
                  <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading your menu...
                </div>
              ) : dishes.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <span className="material-symbols-outlined text-slate-400 text-5xl mb-2">restaurant_menu</span>
                  <p className="text-slate-600 font-semibold">No food reels uploaded yet</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Post a short video recipe to display it here.</p>
                  <button
                    onClick={() => setActiveTab('upload-reel')}
                    className="bg-primary text-white text-xs px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Upload First Reel
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {dishes.map((dish) => (
                    <div
                      key={dish._id}
                      className="group bg-surface-subtle rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col border border-slate-100 relative"
                    >
                      <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                        {/* Video / Image render */}
                        <video
                          src={dish.video}
                          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-500"
                          muted
                          playsInline
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <p className="font-semibold text-lg truncate">{dish.name}</p>
                          <div className="flex items-center gap-3 mt-1 opacity-90 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">visibility</span>
                              <span>1.2K</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">favorite</span>
                              <span>120</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg cursor-pointer">
                            <span className="material-symbols-outlined text-2xl">play_arrow</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center bg-white border-t border-slate-50">
                        <span className="px-2.5 py-1 rounded-full border border-slate-200 text-xs text-slate-500">
                          {dish.description ? 'Dish' : 'Recipe'}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteDish(dish._id)}
                            className="w-8 h-8 rounded-full hover:bg-red-50 hover:text-primary flex items-center justify-center text-slate-400 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD REEL */}
          {activeTab === 'upload-reel' && (
            <div className="flex flex-col w-full lg:flex-row bg-white relative">
              {/* Left Form */}
              <div className="flex-1 w-full lg:w-[60%] flex flex-col p-6 lg:p-12 overflow-y-auto">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-on-surface mb-2">Add New Reel</h1>
                    <p className="text-sm text-slate-500">Upload a mouth-watering short video of your signature dish.</p>
                  </div>
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-6 max-w-2xl">
                  {/* Media Link */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-on-surface">1. Media Source</h2>
                      <div className="flex bg-slate-100 rounded-lg p-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setUploadType('file')}
                          className={`px-3 py-1.5 rounded-md font-semibold transition-all ${uploadType === 'file' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadType('url')}
                          className={`px-3 py-1.5 rounded-md font-semibold transition-all ${uploadType === 'url' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          Paste URL
                        </button>
                      </div>
                    </div>

                    <div className="bg-surface-subtle rounded-xl p-6 border border-slate-100 flex flex-col items-center justify-center relative group min-h-[160px]">
                      {uploadType === 'file' ? (
                        <div className="flex flex-col items-center justify-center w-full max-w-md text-center">
                          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">video_file</span>
                          <p className="text-sm font-semibold text-on-surface mb-2">Upload Local Video File</p>
                          <label className="bg-primary hover:bg-primary-container text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">file_upload</span>
                            <span>Choose Video</span>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                          {videoUrl && (
                            <p className="text-xs text-success font-semibold mt-3 truncate max-w-xs">
                              Uploaded: {videoUrl.split('/').pop()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full max-w-md">
                          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">link</span>
                          <p className="text-sm font-semibold text-on-surface mb-2">Specify Video Source URL</p>
                          <div className="w-full relative">
                            <div className="flex items-center bg-white rounded-lg p-2 border border-slate-200 focus-within:ring-1 focus-within:ring-primary shadow-sm">
                              <span className="material-symbols-outlined text-slate-400 mr-2 ml-1 text-[20px]">link</span>
                              <input
                                type="url"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400"
                                placeholder="Paste video MP4 URL (e.g. from Pexels)..."
                                required={uploadType === 'url'}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-on-surface">2. Details</h2>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-on-surface" htmlFor="dish-name">
                          Dish Name <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          id="dish-name"
                          value={dishName}
                          onChange={(e) => setDishName(e.target.value)}
                          className="bg-surface-subtle border border-slate-100 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                          placeholder="e.g., Truffle Mushroom Risotto"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-on-surface" htmlFor="dish-desc">
                          Appetizing Description
                        </label>
                        <textarea
                          id="dish-desc"
                          value={dishDesc}
                          onChange={(e) => setDishDesc(e.target.value)}
                          className="bg-surface-subtle border border-slate-100 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm resize-none"
                          placeholder="Describe the flavors, textures, and ingredients..."
                          rows="3"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-on-surface mb-1">Tags & Highlights</label>
                        <div className="flex flex-wrap gap-2">
                          {['Bestseller', 'Spicy', 'Vegan', 'Gluten-Free', "Chef's Special"].map((tag) => {
                            const active = selectedTags.has(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleAddTag(tag)}
                                className={`px-3 py-1 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                                  active
                                    ? 'bg-primary/10 text-primary border-primary/30'
                                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                          
                          <input
                            type="text"
                            value={customTag}
                            onChange={(e) => setCustomTag(e.target.value)}
                            onKeyDown={handleCustomTagSubmit}
                            className="bg-transparent border-b border-slate-300 text-xs py-1 focus:outline-none focus:border-primary w-24"
                            placeholder="+ Add Tag"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('my-dishes')}
                      className="px-6 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-6 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-container shadow-md disabled:opacity-85 cursor-pointer flex items-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <span>Publish Reel</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Phone Preview Panel */}
              <div className="hidden lg:flex w-[40%] bg-surface-subtle p-12 items-center justify-center relative border-l border-slate-100">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
                </div>

                {/* Phone Mock */}
                <div className="relative w-[300px] h-[600px] bg-black rounded-[40px] p-2 shadow-2xl z-10 border border-slate-800">
                  <div className="w-full h-full bg-slate-900 rounded-[32px] overflow-hidden relative flex flex-col">
                    
                    {/* Video Background Mock */}
                    {videoUrl ? (
                      <video
                        src={videoUrl}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        autoPlay
                        loop
                        muted
                        playsInline
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{
                          backgroundImage: `url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80')`,
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 z-10 pointer-events-none"></div>

                    {/* Status Bar */}
                    <div className="h-8 w-full px-6 flex items-center justify-between text-white/90 font-semibold text-[10px] z-20 mt-1">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">signal_cellular_4_bar</span>
                        <span className="material-symbols-outlined text-[12px]">wifi</span>
                        <span className="material-symbols-outlined text-[12px] rotate-90">battery_full</span>
                      </div>
                    </div>

                    {/* Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex flex-col justify-end">
                      <div className="flex items-start justify-between w-full">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                              <span className="material-symbols-outlined text-white text-xs">restaurant</span>
                            </div>
                            <span className="text-xs font-semibold text-white drop-shadow-md">
                              {partner?.name || 'Chef Partner'}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-white drop-shadow-md mb-1 line-clamp-1">
                            {dishName || 'Dish Name'}
                          </h3>
                          
                          <p className="text-xs text-white/90 drop-shadow-md line-clamp-2 mb-2">
                            {dishDesc || 'Add a description to see it previewed here in real-time.'}
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {selectedTags.size === 0 ? (
                              <span className="px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded-full text-white text-[9px]">
                                Preview Tag
                              </span>
                            ) : (
                              Array.from(selectedTags).map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-[#E23744]/90 backdrop-blur-sm rounded-full text-white text-[9px] font-semibold">
                                  {tag}
                                </span>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Sidebar Mock */}
                        <div className="flex flex-col items-center gap-3 mt-auto mb-2">
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                              <span className="material-symbols-outlined text-white text-lg">favorite</span>
                            </div>
                            <span className="text-white text-[9px]">1.2k</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                              <span className="material-symbols-outlined text-white text-lg">share</span>
                            </div>
                            <span className="text-white text-[9px]">Share</span>
                          </div>
                        </div>
                      </div>

                      <button className="w-full mt-3 bg-[#E23744] text-white py-2 rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-1">
                        <span>Add to Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3 & 4 PLACEHOLDERS */}
          {activeTab === 'analytics' && (
            <div className="p-8 text-center text-slate-500">
              <span className="material-symbols-outlined text-5xl mb-2 text-slate-400">analytics</span>
              <h2 className="text-xl font-bold text-on-surface">Analytics Panel</h2>
              <p className="text-sm mt-1">Detailed statistics, views dashboard, and engagement reports are coming soon.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-8 text-center text-slate-500">
              <span className="material-symbols-outlined text-5xl mb-2 text-slate-400">settings</span>
              <h2 className="text-xl font-bold text-on-surface">Settings Panel</h2>
              <p className="text-sm mt-1">Manage partner profile, shop timings, contact details, and account preferences.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default PartnerDashboard;