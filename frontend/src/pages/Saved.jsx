import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

function Saved() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    try {
      const response = await api.get(`/food/save?t=${Date.now()}`);
      setSavedItems(response.data.savedFoods || []);
      const savedIds = (response.data.savedFoods || []).map(item => item.food?._id).filter(Boolean);
      localStorage.setItem('saved_dishes', JSON.stringify(savedIds));
    } catch (err) {
      console.error("Backend fetch failed, falling back to local storage:", err);
      try {
        const localSavedIds = JSON.parse(localStorage.getItem('saved_dishes') || '[]');
        if (localSavedIds.length > 0) {
          const foodRes = await api.get(`/food?t=${Date.now()}`);
          const allDishes = foodRes.data.foodItems || [];
          const localSavedDishes = allDishes
            .filter(d => localSavedIds.includes(d._id))
            .map(d => ({ _id: `local_${d._id}`, food: d }));
          setSavedItems(localSavedDishes);
        } else {
          setSavedItems([]);
        }
      } catch (localErr) {
        setSavedItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (foodId) => {
    let localSaved = JSON.parse(localStorage.getItem('saved_dishes') || '[]');
    localSaved = localSaved.filter(id => id !== foodId);
    localStorage.setItem('saved_dishes', JSON.stringify(localSaved));

    setSavedItems(savedItems.filter((item) => item.food?._id !== foodId));

    try {
      await api.post('/food/save', { foodId });
      toast.success('Removed from bookmarks');
    } catch (err) {
      console.log('Backend unsave sync failed, removed locally:', err);
      toast.success('Removed locally');
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface mb-1">Saved Dishes</h1>
        <p className="text-xs text-slate-500">Your bookmarked recipe videos and culinary highlights.</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20 text-slate-500">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading bookmarks...
        </div>
      ) : savedItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 text-center">
          <span className="material-symbols-outlined text-5xl mb-2 text-slate-300">bookmark</span>
          <p className="font-semibold text-sm">No bookmarked reels yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Save dishes while browsing the Reels Feed to view them here later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {savedItems.map((item) => {
            const dish = item.food;
            if (!dish) return null; // Safe check
            return (
              <div
                key={item._id}
                className="group bg-surface-subtle rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border border-slate-100 flex flex-col relative"
              >
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                  <video
                    src={dish.video}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-500"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* Remove Bookmark Button (Top Right) */}
                  <button
                    onClick={() => handleUnsave(dish._id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center z-20 cursor-pointer shadow-md transition-all"
                    title="Remove Bookmark"
                  >
                    <span className="material-symbols-outlined text-lg text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                      bookmark
                    </span>
                  </button>

                  {/* Title Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-bold text-xs truncate drop-shadow-md">{dish.name}</p>
                    <p className="text-[10px] text-white/80 truncate drop-shadow-md">
                      By {dish.foodPartner?.name || 'Chef Partner'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Saved;
