import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import VideoCard from '../components/VideoCard';
import Discover from './Discover';
import Saved from './Saved';
import Profile from './Profile';
import ChannelView from './ChannelView';

function Home() {
  const [activeTab, setActiveTab] = useState('reels'); // 'reels' | 'discover' | 'saved' | 'profile' | 'channel'
  const [activeSubTab, setActiveSubTab] = useState('trending'); // 'trending' | 'near-you'
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [user, setUser] = useState(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast.error('Please log in to browse reels');
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchDishes();
  }, [navigate]);

  const fetchDishes = async () => {
    try {
      const response = await api.get(`/food?t=${Date.now()}`);
      const items = response.data.foodItems || [];
      
      // Simulate distance markers for each dish (e.g. index-based)
      const simulatedItems = items.map((item, index) => ({
        ...item,
        distance: (index + 1) * 1.5, // 1.5 km, 3.0 km, 4.5 km, 6.0 km, etc.
      }));

      setDishes(simulatedItems);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reels feed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubTabChange = (subTab) => {
    setActiveSubTab(subTab);
    setActiveCardIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  // Filter between Trending and Near You
  useEffect(() => {
    if (activeSubTab === 'near-you') {
      // Filter dishes that are within 5 km distance
      setFilteredDishes(dishes.filter((dish) => dish.distance <= 5));
    } else {
      setFilteredDishes(dishes);
    }
  }, [activeSubTab, dishes]);

  const handleScroll = (e) => {
    if (containerRef.current) {
      const { scrollTop, clientHeight } = e.target;
      if (clientHeight > 0) {
        const index = Math.round(scrollTop / clientHeight);
        if (index !== activeCardIndex) {
          setActiveCardIndex(index);
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleSelectDish = (dishId) => {
    setActiveSubTab('trending');
    const targetList = dishes;
    setFilteredDishes(targetList);
    const index = targetList.findIndex((d) => d._id === dishId);
    const targetIndex = index !== -1 ? index : 0;
    
    setActiveTab('reels');
    setActiveCardIndex(targetIndex);

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = targetIndex * containerRef.current.clientHeight;
      }
    }, 150);
  };

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col justify-between overflow-hidden relative">
      
      {/* Decorative ambient blobs (only visible on PC/desktop) */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Top Header - Responsive */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm flex items-center justify-between px-6 h-14 select-none">
        <div 
          onClick={() => { setActiveTab('reels'); handleSubTabChange('trending'); }}
          className="flex items-center gap-2 cursor-pointer select-none active:scale-[0.98] transition-transform"
        >
          <img
            alt="Food Reels Logo"
            className="h-7 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XKMcRFTanevaj90cKvBEwuYo-nKXd0WNQFCiUIERi5tvpLocOHImBsco8Y0ssH3uTqkIamv7TOmxUeNmn-eOF0409tFZnb8PvJ_dNP5Bk88McCaW-ECdc2dJFUpqjUzn7H9B_i8K95x9bpEDWTt5Y-8AA-yYRuPgUJI1mJQaJj2ljyu8z_3wgq8Kr6STwbQO8yahjUbygM2VQSWk6c1h8z4oF_MuzNRPtpWKOt3HeCq_ZWSt7OkiHqHA"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="font-bold text-lg text-on-surface">Reels Feed</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            Hello, {user?.name || 'User'}
          </span>
          <button 
            onClick={handleLogout}
            className="w-8 h-8 rounded-full bg-primary hover:bg-primary-container text-white flex items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-transform"
            title="Logout"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </header>

      {/* Main scrolling viewport (Desktop centered wrapper) */}
      <div className="flex-1 flex justify-center items-center pt-14 pb-16 bg-slate-900 z-10 relative overflow-hidden">
        
        {/* Device Wrapper - Full Screen on mobile, centered phone container on PC */}
        <div className="relative w-full max-w-md h-[calc(100vh-120px)] bg-white shadow-2xl md:rounded-2xl md:border border-slate-800 flex flex-col overflow-hidden my-auto">
          
          {/* TAB 1: REELS FEED */}
          {activeTab === 'reels' && (
            <div className="w-full h-full relative flex flex-col bg-black">
              {/* Top Tabs Overlay */}
              <div className="absolute top-0 left-0 w-full z-30 pt-4 pb-4 flex justify-center gap-6 bg-gradient-to-b from-black/60 to-transparent">
                <button 
                  onClick={() => handleSubTabChange('trending')}
                  className={`font-bold text-sm px-2 py-1 drop-shadow-md cursor-pointer transition-all ${
                    activeSubTab === 'trending' ? 'text-white border-b-2 border-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Trending
                </button>
                <button 
                  onClick={() => handleSubTabChange('near-you')}
                  className={`font-bold text-sm px-2 py-1 drop-shadow-md cursor-pointer transition-all ${
                    activeSubTab === 'near-you' ? 'text-white border-b-2 border-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Near You
                </button>
              </div>

              {/* Loading / Empty states */}
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-white gap-2 bg-slate-950">
                  <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
                  <p className="text-xs text-slate-400 font-semibold">Cooking your feed...</p>
                </div>
              ) : filteredDishes.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 text-center bg-slate-950">
                  <span className="material-symbols-outlined text-slate-500 text-5xl mb-2">movie</span>
                  <p className="font-semibold text-sm">No dishes found nearby</p>
                  <p className="text-xs text-slate-400 mt-1">There are no food partner uploads under 5 km.</p>
                  <button 
                    onClick={() => setActiveSubTab('trending')}
                    className="mt-4 bg-primary text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-primary-container"
                  >
                    Show Trending Feed
                  </button>
                </div>
              ) : (
                /* Scroll Container */
                <div
                  ref={containerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth"
                  style={{
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                  }}
                >
                  {filteredDishes.map((dish, index) => (
                    <div key={dish._id} className="w-full h-full snap-start">
                      <VideoCard
                        dish={dish}
                        isActive={index === activeCardIndex}
                        onPartnerClick={(partnerId) => {
                          setSelectedPartnerId(partnerId);
                          setActiveTab('channel');
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DISCOVER */}
          {activeTab === 'discover' && <Discover onSelectDish={handleSelectDish} />}

          {/* TAB 3: SAVED */}
          {activeTab === 'saved' && <Saved onSelectDish={handleSelectDish} />}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && <Profile />}

          {/* TAB 5: CHANNEL VIEW */}
          {activeTab === 'channel' && (
            <ChannelView
              partnerId={selectedPartnerId}
              onBack={() => setActiveTab('reels')}
              onSelectDish={handleSelectDish}
            />
          )}

        </div>
      </div>

      {/* Bottom Nav Bar - Sticky & Active Color Highlighting */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-1px_8px_rgba(0,0,0,0.04)] h-16 select-none">
        <div className="flex justify-around items-center h-full max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab('reels')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
              activeTab === 'reels' ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined">play_circle</span>
            <span className="text-[10px]">Reels</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
              activeTab === 'discover' ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined">explore</span>
            <span className="text-[10px]">Discover</span>
          </button>

          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
              activeTab === 'saved' ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined">bookmark</span>
            <span className="text-[10px]">Saved</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
              activeTab === 'profile' ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined">account_circle</span>
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </nav>

    </div>
  );
}

export default Home;