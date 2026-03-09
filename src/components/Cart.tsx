import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export default function Cart({ isOpen, onClose, items, updateQuantity, removeItem, clearCart }: CartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
          total
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Order placed! ID: ${data.orderId}`);
        clearCart();
        onClose();
        setCustomerName('');
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-emerald-600" />
                <h2 className="text-xl font-sans font-bold text-gray-900">Your Cart</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <ShoppingBag size={48} />
                  <p className="text-gray-500 font-medium">Your cart is empty</p>
                  <button 
                    onClick={onClose}
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="flex-1 space-y-1">
                      <h4 className="font-sans font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-white rounded-md transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-black/5 bg-gray-50 space-y-4">
                <div className="space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Your Name</span>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name to order"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500 font-medium">Total Amount</span>
                  <span className="text-2xl font-mono font-bold text-gray-900">₹{total}</span>
                </div>

                <button
                  disabled={isCheckingOut}
                  onClick={handleCheckout}
                  className={cn(
                    "w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg transition-all active:scale-[0.98]",
                    isCheckingOut 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20"
                  )}
                >
                  {isCheckingOut ? 'Placing Order...' : 'Place Order'}
                  {!isCheckingOut && <ArrowRight size={20} />}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
