'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import ChannelSwitcher from '@/components/ChannelSwitcher';
import CustomerSelector from '@/components/CustomerSelector';
import AdminDashboard from '@/components/AdminDashboard';
import NotificationSystem, { useNotifications } from '@/components/NotificationSystem';
import { LayoutDashboard, MessageSquare, Sparkles, Zap } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Home() {
  const [view, setView] = useState<'chat' | 'dashboard'>('chat');
  const { customer, cart, analytics } = useStore();
  const { notifications, removeNotification, showSuccess, showCartUpdate } = useNotifications();
  
  useEffect(() => {
    // Welcome notification for new customers
    if (customer && analytics.conversationSteps === 0) {
      showSuccess(
        `Welcome ${customer.name}!`,
        `You're a ${customer.loyaltyTier} member with ${customer.loyaltyPoints} points`,
        6000
      );
    }
  }, [customer]);
  
  useEffect(() => {
    // Cart update notifications
    if (cart.length > 0) {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      showCartUpdate(
        'Cart Updated',
        `${cart.length} items • ₹${total.toFixed(0)}`,
        {
          label: 'View Cart',
          onClick: () => setView('chat')
        }
      );
    }
  }, [cart.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50">
      <NotificationSystem 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
      
      <header className="bg-gradient-to-r from-brand-primary via-gray-900 to-brand-primary text-white shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-secondary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  ABFRL
                </h1>
                <p className="text-sm text-gray-300 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  AI-Powered Agentic Sales Platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {customer && (
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold">{customer.name}</p>
                  <p className="text-xs text-gray-300">
                    {customer.loyaltyTier.toUpperCase()} • {customer.loyaltyPoints} pts
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => setView('chat')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    view === 'chat' 
                      ? 'bg-brand-secondary shadow-lg' 
                      : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  Chat Interface
                </button>
                <button
                  onClick={() => setView('dashboard')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    view === 'dashboard' 
                      ? 'bg-brand-secondary shadow-lg' 
                      : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {view === 'chat' ? (
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-[calc(100vh-140px)] overflow-hidden">
                <ChatInterface />
              </div>
            </div>
            <div className="space-y-6">
              <CustomerSelector />
              <ChannelSwitcher />
              
              {/* Enhanced Quick Actions */}
              <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-semibold text-purple-800">🛍️ Browse Products</p>
                    <p className="text-xs text-purple-600">"Show me formal wear"</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-800">📦 Check Stock</p>
                    <p className="text-xs text-blue-600">"Check stock for LV001"</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-800">🛒 Add to Cart</p>
                    <p className="text-xs text-green-600">"Add polo shirt to cart"</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm font-semibold text-orange-800">💳 Checkout</p>
                    <p className="text-xs text-orange-600">"Proceed to checkout"</p>
                  </div>
                </div>
              </div>
              
              {/* Live Stats */}
              <div className="bg-gradient-to-br from-brand-primary to-gray-800 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-bold mb-4">Live Session</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm opacity-90">Messages:</span>
                    <span className="font-bold">{analytics.conversationSteps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm opacity-90">Cart Items:</span>
                    <span className="font-bold">{cart.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm opacity-90">Cart Value:</span>
                    <span className="font-bold">₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AdminDashboard />
        )}
      </main>

      <footer className="bg-gradient-to-r from-brand-primary to-gray-900 text-white text-center py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-secondary" />
              <span className="font-semibold">Powered by Agentic AI Architecture</span>
            </div>
            <div className="text-sm opacity-90">
              🏆 Built for All India National Hackathon 2024
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>🚀 Production Ready</span>
              <span>⚡ Real-time Analytics</span>
              <span>🔒 Secure Payments</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
