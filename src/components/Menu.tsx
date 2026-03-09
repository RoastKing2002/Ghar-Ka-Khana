import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, ShoppingBag, Clock } from 'lucide-react';
import { InventoryItem, CartItem } from '../types';
import { cn } from '../lib/utils';

interface MenuProps {
  inventory: InventoryItem[];
  addToCart: (item: InventoryItem) => void;
}

export default function Menu({ inventory, addToCart }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Today');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = days[(new Date().getDay() + 6) % 7]; // Adjust for Monday start

  const categories = ['Today', ...days, 'Accompaniments', 'Snacks', 'Prantha Meals'];

  const filteredItems = inventory.filter(item => {
    if (activeCategory === 'Today') return item.day === today;
    if (days.includes(activeCategory)) return item.day === activeCategory;
    return item.category === activeCategory;
  });

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-sans font-bold tracking-tight text-gray-900">Our Menu</h1>
          <p className="text-gray-500 max-w-2xl">Freshly prepared homemade meals delivered to your doorstep. Choose from our daily specials or our all-time favorites.</p>
        </header>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-600 hover:text-emerald-600"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl border border-black/5 p-5 flex flex-col justify-between hover:shadow-xl hover:shadow-black/5 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-sans font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
                        {item.category}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600">₹{item.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock size={14} />
                    <span>Prep time: 20-30 mins</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xs">
                    {item.stock > 0 ? (
                      <span className="text-emerald-600 font-medium">In Stock: {item.stock}</span>
                    ) : (
                      <span className="text-red-500 font-medium">Out of Stock</span>
                    )}
                  </div>
                  <button
                    disabled={item.stock <= 0}
                    onClick={() => addToCart(item)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                      item.stock > 0
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200 active:scale-95"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <Plus size={18} />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
