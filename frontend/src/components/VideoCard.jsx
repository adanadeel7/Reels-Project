import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function VideoCard({ dish, isActive, onPartnerClick }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [muted, setMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  const youtubeId = getYouTubeId(dish.video);
  const [isYoutubePlaying, setIsYoutubePlaying] = useState(true);

  // Check if item is already saved or liked
  useEffect(() => {
    // 1. Check local storage first (instant update)
    const localSaved = JSON.parse(localStorage.getItem('saved_dishes') || '[]');
    const isSavedLocally = localSaved.includes(dish._id);
    setIsSaved(isSavedLocally);

    // 2. Query saves from backend in background to ensure sync
    const checkInitialState = async () => {
      try {
        const saveRes = await api.get('/food/save');
        const savedList = saveRes.data.savedFoods || [];
        const saved = savedList.some((item) => item.food?._id === dish._id);
        setIsSaved(saved);
        
        // Sync local storage if needed
        const localSavedNow = JSON.parse(localStorage.getItem('saved_dishes') || '[]');
        if (saved && !localSavedNow.includes(dish._id)) {
          localSavedNow.push(dish._id);
          localStorage.setItem('saved_dishes', JSON.stringify(localSavedNow));
        } else if (!saved && localSavedNow.includes(dish._id)) {
          const filtered = localSavedNow.filter(id => id !== dish._id);
          localStorage.setItem('saved_dishes', JSON.stringify(filtered));
        }
      } catch (err) {
        console.error("Backend save state sync error:", err);
      }
    };
    checkInitialState();
  }, [dish._id]);

  // Play/Pause based on active state from parent container
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const startPlayback = () => {
        video.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Autoplay blocked or failed:", err);
            setIsPlaying(false);
          });
      };

      if (video.readyState >= 3) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
        startPlayback();
      } else {
        video.addEventListener('canplay', startPlayback);
      }

      return () => {
        video.removeEventListener('canplay', startPlayback);
      };
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleVideoClick = () => {
    if (youtubeId) {
      setIsYoutubePlaying(!isYoutubePlaying);
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleLike = async () => {
    try {
      const response = await api.post('/food/like', { foodId: dish._id });
      setIsLiked(!isLiked);
      toast.success(response.data.message || 'Updated likes');
    } catch (err) {
      toast.error('Failed to update likes');
    }
  };

  const handleSave = async () => {
    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    // Update Local Storage immediately
    let localSaved = JSON.parse(localStorage.getItem('saved_dishes') || '[]');
    if (nextSavedState) {
      if (!localSaved.includes(dish._id)) {
        localSaved.push(dish._id);
      }
    } else {
      localSaved = localSaved.filter((id) => id !== dish._id);
    }
    localStorage.setItem('saved_dishes', JSON.stringify(localSaved));

    try {
      const response = await api.post('/food/save', { foodId: dish._id });
      toast.success(response.data.message || (nextSavedState ? 'Saved to bookmarks' : 'Removed from bookmarks'));
    } catch (err) {
      console.log('Backend bookmark sync failed, kept in local storage:', err);
      toast.success(nextSavedState ? 'Saved locally' : 'Removed locally');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: dish.name,
          text: `Check out this delicious ${dish.name} recipe reel!`,
          url: dish.video,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(dish.video);
        toast.success('Video link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <div className="scroll-snap-align-start flex-shrink-0 w-full h-full relative bg-black flex items-center justify-center snap-start">
      
      {/* Video Element */}
      {youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${(isActive && isYoutubePlaying) ? 1 : 0}&mute=${muted ? 1 : 0}&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1`}
          className="w-full h-full object-cover z-0 pointer-events-none scale-[1.35] origin-center"
          allow="autoplay; encrypted-media"
          title={dish.name}
          frameBorder="0"
        />
      ) : hasError ? (
        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-center p-6 text-white z-0 select-none">
          <span className="material-symbols-outlined text-5xl text-primary mb-2">restaurant</span>
          <p className="font-bold text-sm">Media Loading Issue</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs px-4">
            Could not stream video. Please check your connection or video source.
          </p>
        </div>
      ) : (
        <video
          key={dish._id}
          ref={videoRef}
          src={dish.video}
          onClick={handleVideoClick}
          className="w-full h-full object-cover z-0 cursor-pointer"
          loop
          playsInline
          muted={muted}
          preload="auto"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      )}

      {/* Scrim Overlay */}
      <div 
        onClick={handleVideoClick}
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-10 pointer-events-auto cursor-pointer"
      />

      {/* Mute Toggle Icon Overlay (Top-Right) */}
      <button 
        onClick={() => setMuted(!muted)}
        className="absolute right-4 top-16 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
      >
        <span className="material-symbols-outlined text-xl">
          {muted ? 'volume_off' : 'volume_up'}
        </span>
      </button>

      {/* Right Sidebar Actions */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-6 pb-4">
        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-90 hover:bg-black/40">
            <span 
              className={`material-symbols-outlined text-[28px] drop-shadow-md transition-colors ${
                isLiked ? 'text-primary' : 'text-white'
              }`}
              style={{ fontVariationSettings: `'FILL' ${isLiked ? 1 : 0}` }}
            >
              favorite
            </span>
          </div>
          <span className="text-white text-xs drop-shadow-md font-semibold">
            {isLiked ? '1.3K' : '1.2K'}
          </span>
        </button>

        {/* Save */}
        <button onClick={handleSave} className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-90 hover:bg-black/40">
            <span 
              className={`material-symbols-outlined text-[28px] drop-shadow-md transition-colors ${
                isSaved ? 'text-amber-500' : 'text-white'
              }`}
              style={{ fontVariationSettings: `'FILL' ${isSaved ? 1 : 0}` }}
            >
              bookmark
            </span>
          </div>
          <span className="text-white text-xs drop-shadow-md font-semibold">Save</span>
        </button>

        {/* Share */}
        <button 
          onClick={handleShare} 
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-90 hover:bg-black/40">
            <span className="material-symbols-outlined text-white text-[28px] drop-shadow-md">share</span>
          </div>
          <span className="text-white text-xs drop-shadow-md font-semibold">Share</span>
        </button>
      </div>

      {/* Bottom Info & Action Buttons */}
      <div className="absolute bottom-4 left-0 w-full p-4 z-20 flex flex-col gap-4 pr-20 pb-6 pointer-events-auto">
        {/* Restaurant/Chef Profile */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => dish.foodPartner?._id && onPartnerClick && onPartnerClick(dish.foodPartner._id)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm overflow-hidden flex-shrink-0 border border-slate-200 group-hover:ring-2 group-hover:ring-primary transition-all">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&auto=format&fit=crop&q=80"
                alt="Restaurant Logo"
              />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-white font-bold drop-shadow-md text-sm group-hover:text-primary transition-colors">
                  {dish.foodPartner?.name || 'Chef Partner'}
                </span>
                <span className="material-symbols-outlined text-success text-[16px] drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <span className="text-white/80 text-xs drop-shadow-md">
                {dish.foodPartner?.email || 'Partner'} • 1.2 km away
              </span>
            </div>
          </div>
          <button className="ml-auto px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold text-xs shadow-sm active:scale-95 transition-transform hover:bg-white/30 cursor-pointer">
            Follow
          </button>
        </div>

        {/* Dish Title & Description */}
        <div className="flex flex-col gap-1 text-left">
          <h2 className="text-white font-bold text-lg drop-shadow-md line-clamp-1">{dish.name}</h2>
          <p className="text-white/90 text-xs drop-shadow-md line-clamp-2">
            {dish.description || 'Watch how we make this signature recipe! Fresh ingredients prepared by culinary experts.'}
          </p>
        </div>

        {/* Order Button */}
        <button 
          onClick={() => toast.success(`Order placed for ${dish.name}!`, { icon: '🍔' })}
          className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] hover:bg-primary-container transition-transform mt-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
          <span>Order Now • $18</span>
        </button>
      </div>

    </div>
  );
}

export default VideoCard;
