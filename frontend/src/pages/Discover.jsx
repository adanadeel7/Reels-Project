import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const CATEGORIES = ['All', 'Pasta', 'Pizza', 'Seafood', 'Dessert', 'Bestseller', 'Spicy', 'Vegan'];

function Discover() {
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await api.get(`/food?t=${Date.now()}`);
      const items = response.data.foodItems || [];
      setDishes(items);
      setFilteredDishes(items);
    } catch (err) {
      toast.error('Failed to load discovery feed');
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  useEffect(() => {
    let result = dishes;

    // Filter by search term
    if (searchTerm.trim() !== '') {
      result = result.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (dish.description && dish.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category chip
    if (selectedCategory !== 'All') {
      result = result.filter((dish) => {
        const dishTags = dish.tags || [];
        // Check tag match (case insensitive)
        return (
          dishTags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase()) ||
          dish.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          (dish.description && dish.description.toLowerCase().includes(selectedCategory.toLowerCase()))
        );
      });
    }

    setFilteredDishes(result);
  }, [searchTerm, selectedCategory, dishes]);

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto pb-24">
      {/* Search Header */}
      <div className="mb-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface mb-1">Discover</h1>
          <p className="text-xs text-slate-500">Explore cooking reels and recipes from top local chefs.</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-surface-subtle border border-slate-100 rounded-xl px-4 py-3 shadow-sm focus-within:ring-1 focus-within:ring-primary">
          <span className="material-symbols-outlined text-slate-400 mr-2">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-on-surface"
            placeholder="Search pizza, pasta, chef recipes..."
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Chips Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar scroll-smooth flex-nowrap">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === category
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20 text-slate-500">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading feed...
        </div>
      ) : filteredDishes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined text-5xl mb-2">search_off</span>
          <p className="font-semibold text-sm">No dishes matched your search</p>
          <p className="text-xs text-slate-400 mt-1">Try checking your spelling or search for another keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredDishes.map((dish) => (
            <div
              key={dish._id}
              className="group bg-surface-subtle rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border border-slate-100 flex flex-col relative cursor-pointer"
            >
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                <video
                  src={dish.video}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-500"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                
                {/* Details Overlay */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <p className="font-bold text-xs truncate drop-shadow-md">{dish.name}</p>
                  <p className="text-[10px] text-white/80 truncate drop-shadow-md">
                    By {dish.foodPartner?.name || 'Chef Partner'}
                  </p>
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-xl">play_arrow</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Discover;
