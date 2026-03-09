import React from 'react';
import { ShoppingCart, Utensils, LayoutDashboard, Home } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  activeTab: 'home' | 'menu' | 'dashboard';
  setActiveTab: (tab: 'home' | 'menu' | 'dashboard') => void;
  cartCount: number;
  onCartClick: () => void;
}

export default function Navbar({ activeTab, setActiveTab, cartCount, onCartClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-black/5 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
            <Utensils size={24} />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-gray-900">Ghar Ka Khana</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('home')}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors",
              activeTab === 'home' ? "text-emerald-600" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <Home size={18} />
            <span className="hidden sm:inline">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors",
              activeTab === 'menu' ? "text-emerald-600" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <Utensils size={18} />
            <span className="hidden sm:inline">Menu</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors",
              activeTab === 'dashboard' ? "text-emerald-600" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <LayoutDashboard size={18} />
            <span className="hidden sm:inline">Admin</span>
          </button>
          
          <button
            onClick={onCartClick}
            className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
