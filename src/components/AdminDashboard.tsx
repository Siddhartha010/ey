'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, ShoppingCart, Users, Activity, Clock, Target, Zap, Award } from 'lucide-react';

export default function AdminDashboard() {
  const { analytics, messages, cart, customer, getCartTotal, getSessionDuration } = useStore();
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveStats, setLiveStats] = useState({
    sessionDuration: 0,
    conversationSteps: 0,
    cartTotal: 0,
    conversionRate: 0
  });
  
  useEffect(() => {
    const updateStats = () => {
      const sessionDuration = getSessionDuration();
      const cartTotal = getCartTotal();
      const conversionRate = cart.length > 0 && analytics.conversationSteps > 0 ? ((cart.length / analytics.conversationSteps) * 100) : 0;
      
      setCurrentTime(new Date());
      setLiveStats({
        sessionDuration,
        conversationSteps: analytics.conversationSteps,
        cartTotal,
        conversionRate
      });
      
      setRealTimeData(prev => [
        ...prev.slice(-9),
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          messages: analytics.conversationSteps,
          cartValue: cartTotal,
        }
      ]);
    };
    
    // Initial update
    updateStats();
    
    // Update every 2 seconds
    const interval = setInterval(updateStats, 2000);
    
    return () => clearInterval(interval);
  }, [analytics.conversationSteps, cart.length, getCartTotal, getSessionDuration]);

  const agentData = Object.entries(analytics.agentUsage).map(([name, count]) => ({
    name: name.replace('Agent', ''),
    count,
  }));

  const COLORS = ['#d4af37', '#8b4513', '#1a1a1a', '#4a5568', '#718096'];

  const avgOrderValue = liveStats.cartTotal > 0 ? liveStats.cartTotal : (customer?.avgOrderValue || 0);
  
  const stats = [
    { 
      label: 'Session Duration', 
      value: `${Math.floor(liveStats.sessionDuration / 60)}m ${liveStats.sessionDuration % 60}s`, 
      icon: Clock, 
      color: 'bg-blue-500',
      trend: liveStats.sessionDuration > 60 ? 'Active' : 'New'
    },
    { 
      label: 'Conversation Steps', 
      value: liveStats.conversationSteps, 
      icon: Activity, 
      color: 'bg-green-500',
      trend: liveStats.conversationSteps > 5 ? 'Engaged' : 'Starting'
    },
    { 
      label: 'Cart Value', 
      value: `₹${liveStats.cartTotal.toFixed(0)}`, 
      icon: ShoppingCart, 
      color: 'bg-yellow-500',
      trend: liveStats.cartTotal > 0 ? 'Items Added' : 'Empty'
    },
    { 
      label: 'Conversion Rate', 
      value: `${liveStats.conversionRate.toFixed(1)}%`, 
      icon: Target, 
      color: 'bg-purple-500',
      trend: liveStats.conversionRate > 20 ? 'High' : 'Normal'
    },
  ];
  
  const performanceMetrics = [
    { label: 'Customer Tier', value: customer?.loyaltyTier?.toUpperCase() || 'GUEST', color: 'text-purple-600' },
    { label: 'Loyalty Points', value: customer?.loyaltyPoints || 0, color: 'text-yellow-600' },
    { label: 'Avg Order Value', value: `₹${avgOrderValue.toFixed(0)}`, color: 'text-green-600' },
    { label: 'Status', value: Date.now() - analytics.lastActivity < 30000 ? 'ACTIVE' : 'IDLE', color: Date.now() - analytics.lastActivity < 30000 ? 'text-green-600' : 'text-gray-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-brand-primary to-gray-800 text-white p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold">Live Analytics Dashboard</h2>
            <p className="text-gray-300">Real-time insights • Updated {currentTime.toLocaleTimeString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {performanceMetrics.map((metric, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className={`text-lg font-bold ${metric.color}`}>{metric.value}</p>
              <p className="text-xs text-gray-600">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Agent Usage
            </h3>
            {agentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={agentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: 'none', 
                      borderRadius: '8px', 
                      color: 'white' 
                    }} 
                  />
                  <Bar dataKey="count" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4af37" />
                      <stop offset="100%" stopColor="#8b4513" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No agent activity yet</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Agent Distribution
            </h3>
            {agentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={agentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {agentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: 'none', 
                      borderRadius: '8px', 
                      color: 'white' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Real-time Activity
            </h3>
            {realTimeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={realTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" fontSize={10} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: 'none', 
                      borderRadius: '8px', 
                      color: 'white' 
                    }} 
                  />
                  <Line type="monotone" dataKey="messages" stroke="#8b4513" strokeWidth={3} dot={{ fill: '#d4af37' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Collecting data...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Customer Journey Timeline
        </h3>
        <div className="space-y-3">
          {messages.slice(-8).map((msg, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${msg.role === 'user' ? 'bg-blue-500' : 'bg-green-500'} shadow-lg`} />
                {idx < messages.slice(-8).length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-2" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {msg.role === 'user' ? '👤 Customer' : `🤖 ${msg.agentUsed || 'Assistant'}`}
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {msg.content.length > 100 ? `${msg.content.substring(0, 100)}...` : msg.content}
                </p>
                {msg.agentUsed && (
                  <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                    {msg.agentUsed}
                  </span>
                )}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No conversation activity yet</p>
              <p className="text-xs text-gray-400 mt-1">Start chatting to see the customer journey</p>
            </div>
          )}
        </div>
      </div>
      
      {customer && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            Customer Profile Insights
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-purple-600 mb-2">Loyalty Status</h4>
              <p className="text-2xl font-bold text-gray-800">{customer.loyaltyTier.toUpperCase()}</p>
              <p className="text-sm text-gray-600">{customer.loyaltyPoints} points</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-green-600 mb-2">Shopping Behavior</h4>
              <p className="text-lg font-bold text-gray-800">₹{customer.avgOrderValue}</p>
              <p className="text-sm text-gray-600">Avg Order Value</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-blue-600 mb-2">Preferences</h4>
              <div className="flex flex-wrap gap-1">
                {customer.preferences.map((pref, i) => (
                  <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
