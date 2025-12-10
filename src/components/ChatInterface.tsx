'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ShoppingCart, Sparkles, Package, CreditCard } from 'lucide-react';
import { useStore } from '@/lib/store';
import { SalesAgent } from '@/agents/SalesAgent';

const salesAgent = new SalesAgent();

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, addMessage, sessionState, trackAgentUsage, channel, customer, updateCart, updateSessionState } = useStore();

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSend = async (message?: string) => {
    const messageToSend = message || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: messageToSend,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      const result = await salesAgent.processMessage(messageToSend, sessionState);
      
      trackAgentUsage(result.agentUsed);
      
      // Update cart and session state if changed
      if (result.data?.cart) {
        updateCart(result.data.cart);
      }
      
      // Update session state with any changes
      if (sessionState.cart !== result.data?.cart) {
        updateSessionState({ cart: result.data?.cart || sessionState.cart });
      }

      const assistantMessage = {
        role: 'assistant' as const,
        content: result.response,
        agentUsed: result.agentUsed,
        timestamp: Date.now(),
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const quickActions = [
    { icon: Sparkles, text: 'Show me products', color: 'bg-purple-500' },
    { icon: ShoppingCart, text: 'View my cart', color: 'bg-blue-500' },
    { icon: Package, text: 'Track my order', color: 'bg-green-500' },
    { icon: CreditCard, text: 'Proceed to checkout', color: 'bg-orange-500' },
  ];

  const getChannelStyle = () => {
    switch (channel) {
      case 'whatsapp':
        return 'bg-[#075e54]';
      case 'kiosk':
        return 'bg-gradient-to-br from-purple-900 to-indigo-900';
      case 'mobile':
        return 'bg-gradient-to-br from-blue-600 to-cyan-600';
      default:
        return 'bg-gradient-to-br from-brand-primary to-gray-900';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`${getChannelStyle()} text-white p-4 shadow-lg`}>
        <h2 className="text-xl font-bold">ABFRL AI Assistant</h2>
        <p className="text-sm opacity-90">Channel: {channel.toUpperCase()}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 max-w-md mx-auto">
              <div className="text-4xl mb-4">🛍️</div>
              <p className="text-xl font-semibold text-gray-800">Welcome to ABFRL!</p>
              <p className="text-sm mt-2 text-gray-600">Your AI-powered shopping assistant</p>
              {customer && (
                <div className="mt-4 p-3 bg-gradient-to-r from-brand-secondary to-yellow-400 rounded-lg text-white">
                  <p className="font-semibold">Hello {customer.name}!</p>
                  <p className="text-sm">{customer.loyaltyTier.toUpperCase()} • {customer.loyaltyPoints} points</p>
                </div>
              )}
              
              {showQuickActions && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action.text)}
                        className={`${action.color} text-white p-3 rounded-lg text-xs font-medium hover:opacity-90 transition-all flex items-center gap-2`}
                      >
                        <action.icon className="w-4 h-4" />
                        {action.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-brand-secondary text-white'
                  : 'bg-white shadow-md border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>
              {msg.agentUsed && (
                <p className="text-xs mt-2 opacity-70">🤖 {msg.agentUsed}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-md border border-gray-200 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        {sessionState.cart.length > 0 && (
          <div className="mb-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {sessionState.cart.length} item(s) in cart
                </span>
              </div>
              <button
                onClick={() => handleSend('Show my cart')}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors"
              >
                View Cart
              </button>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-brand-secondary to-yellow-500 text-white p-3 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
