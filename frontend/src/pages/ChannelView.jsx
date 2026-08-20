import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

function ChannelView({ partnerId, onBack, onSelectDish }) {
  const [partner, setPartner] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (partnerId) {
      fetchPartnerProfile();
    }
  }, [partnerId]);

  const fetchPartnerProfile = async () => {
    setLoading(true);
    try {
      // Endpoint: GET /api/food-partner/:id
      const response = await api.get(`/food-partner/${partnerId}`);
      const partnerData = response.data.foodPartner || {};
      setPartner(partnerData);
      setDishes(partnerData.foodItems || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load chef profile');
      onBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-y-auto pb-24">
      {/* Top Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-30 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </button>
        <span className="font-bold text-on-surface text-base">Chef Channel</span>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20 text-slate-500">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading channel...
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Banner & Profile Info */}
          <div className="bg-slate-50 px-6 py-8 border-b border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
            {/* Soft backdrop blur for banner style */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
              <div className="absolute -top-1/4 -right-1/4 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
            </div>

            {/* Profile Avatar */}
            <div className="w-20 h-20 rounded-full bg-white shadow-md border-2 border-primary/20 overflow-hidden mb-3 relative flex items-center justify-center">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80"
                alt="Chef Avatar"
              />
            </div>

            {/* Name */}
            <div className="flex items-center gap-1.5 mb-1 justify-center">
              <h2 className="text-xl font-bold text-on-surface">{partner?.name || 'Chef Partner'}</h2>
              <span className="material-symbols-outlined text-success text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>

            {/* Stats */}
            <p className="text-xs text-slate-400 mb-4">{partner?.email} • {dishes.length} Reels</p>

            {/* Chef Details List */}
            <div className="w-full max-w-xs space-y-2 mt-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 p-4 rounded-xl text-left text-xs text-slate-500 shadow-sm">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm text-slate-400">pin_drop</span>
                <span>{partner?.address || '123 Gourmet Street, Foodville'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-slate-400">call</span>
                <span>{partner?.phone || '555-0199'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-slate-400">person</span>
                <span>Contact: {partner?.contactName || 'Alfredo Mancini'}</span>
              </div>
            </div>
          </div>

          {/* Uploaded Dishes Grid */}
          <div className="p-6">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4 text-left">
              Menu & Reels
            </h3>

            {dishes.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-1">movie</span>
                <p className="text-xs font-semibold">No reels uploaded yet by this chef</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {dishes.map((dish) => (
                  <div
                    key={dish._id}
                    onClick={() => onSelectDish(dish._id)}
                    className="group bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex flex-col relative cursor-pointer hover:shadow-sm"
                  >
                    <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                      <video
                        src={dish.video}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-500"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                      
                      {/* Name overlay */}
                      <div className="absolute bottom-2 left-2 right-2 text-white text-left">
                        <p className="font-bold text-xs truncate drop-shadow-md">{dish.name}</p>
                      </div>

                      {/* Play Hover Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-md">
                          <span className="material-symbols-outlined text-lg">play_arrow</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChannelView;
