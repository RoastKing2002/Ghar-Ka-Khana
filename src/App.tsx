import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Dashboard from './components/Dashboard';
import { InventoryItem, CartItem } from './types';
import toast from 'react-hot-toast';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'dashboard'>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error('Failed to fetch inventory');
    }
  };

  const addToCart = (item: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) {
          toast.error('Not enough stock available');
          return prev;
        }
        toast.success(`Added another ${item.name} to cart`);
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      toast.success(`${item.name} added to cart`);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      
      const newQty = item.quantity + delta;
      if (newQty <= 0) return prev.filter(i => i.id !== id);
      
      const invItem = inventory.find(i => i.id === id);
      if (invItem && newQty > invItem.stock) {
        toast.error('Not enough stock available');
        return prev;
      }
      
      return prev.map(i => i.id === id ? { ...i, quantity: newQty } : i);
    });
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    fetchInventory(); // Refresh stock levels
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Toaster position="bottom-right" />
      
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main>
        {activeTab === 'home' && <Home onOrderClick={() => setActiveTab('menu')} />}
        {activeTab === 'menu' && <Menu inventory={inventory} addToCart={addToCart} />}
        {activeTab === 'dashboard' && <Dashboard />}
      </main>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={clearCart}
      />

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-black/5 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                <Utensils size={18} />
              </div>
              <span className="font-sans font-bold text-lg tracking-tight">Ghar Ka Khana</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Bringing the authentic taste of home-cooked meals to your doorstep. 
              Quality, hygiene, and love in every bite.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-emerald-600 transition-colors">Home</button></li>
              <li><button onClick={() => setActiveTab('menu')} className="hover:text-emerald-600 transition-colors">Menu</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-600 transition-colors">Admin Dashboard</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>159/18, Deol Nagar, Nakodar Road, Jalandhar</li>
              <li>+91 98788 01363</li>
              <li>sehaj8847@gmail.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-500 mb-4">Get updates on our daily specials.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-600 transition-all"
              />
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-black/5 text-center text-xs text-gray-400">
          © 2024 Ghar Ka Khana Cloud Kitchen. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function Utensils({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}
