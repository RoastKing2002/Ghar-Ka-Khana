import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, ClipboardList, TrendingUp, CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';
import { InventoryItem, Order } from '../types';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('orders');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [invRes, ordRes] = await Promise.all([
        fetch('/api/inventory'),
        fetch('/api/orders')
      ]);
      const invData = await invRes.json();
      const ordData = await ordRes.json();
      setInventory(invData);
      setOrders(ordData);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStock = async (id: string, newStock: number) => {
    try {
      await fetch('/api/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stock: newStock })
      });
      setInventory(prev => prev.map(item => item.id === id ? { ...item, stock: newStock } : item));
      toast.success('Stock updated');
    } catch (err) {
      toast.error('Failed to update stock');
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      setOrders(prev => prev.map(order => order.id === id ? { ...order, status: status as any } : order));
      toast.success(`Order marked as ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
    lowStock: inventory.filter(i => i.stock < 10).length
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-sans font-bold tracking-tight text-gray-900 text-emerald-600">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your kitchen operations, inventory, and orders in real-time.</p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.totalOrders, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Low Stock Items', value: stats.lowStock, icon: Package, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-black/5 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{stat.label}</p>
              <p className="text-2xl font-mono font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={cn(
            "px-6 py-4 text-sm font-bold border-b-2 transition-all",
            activeTab === 'orders' ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-900"
          )}
        >
          Orders Management
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={cn(
            "px-6 py-4 text-sm font-bold border-b-2 transition-all",
            activeTab === 'inventory' ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-900"
          )}
        >
          Inventory Control
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        {activeTab === 'orders' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-bold text-gray-400">#{order.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.customer_name}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                        order.status === 'pending' && "bg-amber-100 text-amber-700",
                        order.status === 'preparing' && "bg-blue-100 text-blue-700",
                        order.status === 'delivered' && "bg-emerald-100 text-emerald-700",
                        order.status === 'cancelled' && "bg-red-100 text-red-700"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Start Preparing"
                          >
                            <Clock size={18} />
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Mark Delivered"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Order"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 font-mono">₹{item.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          item.stock > 20 ? "bg-emerald-500" : item.stock > 5 ? "bg-amber-500" : "bg-red-500"
                        )} />
                        <span className="font-mono font-bold">{item.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateStock(item.id, Math.max(0, item.stock - 10))}
                          className="px-2 py-1 text-[10px] font-bold bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                        >
                          -10
                        </button>
                        <button 
                          onClick={() => updateStock(item.id, item.stock + 10)}
                          className="px-2 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
