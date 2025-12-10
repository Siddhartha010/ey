import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer } from '@/data/customers';
import { Message, SessionState, CartItem } from '@/agents/SalesAgent';

interface AppState {
  sessionId: string;
  channel: 'web' | 'mobile' | 'whatsapp' | 'kiosk';
  customer: Customer | null;
  messages: Message[];
  cart: CartItem[];
  sessionState: SessionState;
  analytics: {
    agentUsage: Record<string, number>;
    conversationSteps: number;
    cartValue: number;
    sessionStartTime: number;
    lastActivity: number;
  };
  ui: {
    isTyping: boolean;
    currentAgent: string;
    showNotifications: boolean;
    theme: 'light' | 'dark';
  };
  
  setChannel: (channel: 'web' | 'mobile' | 'whatsapp' | 'kiosk') => void;
  setCustomer: (customer: Customer | null) => void;
  addMessage: (message: Message) => void;
  updateCart: (cart: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;
  updateSessionState: (state: Partial<SessionState>) => void;
  trackAgentUsage: (agent: string) => void;
  setTyping: (isTyping: boolean, agent?: string) => void;
  resetSession: () => void;
  getCartTotal: () => number;
  getSessionDuration: () => number;
}

export const useStore = create<AppState>()(persist((set, get) => ({
  sessionId: `SESSION_${Date.now()}`,
  channel: 'web',
  customer: null,
  messages: [],
  cart: [],
  sessionState: {
    cart: [],
    context: [],
    channel: 'web',
  },
  analytics: {
    agentUsage: {},
    conversationSteps: 0,
    cartValue: 0,
    sessionStartTime: Date.now(),
    lastActivity: Date.now(),
  },
  ui: {
    isTyping: false,
    currentAgent: '',
    showNotifications: true,
    theme: 'light',
  },

  setChannel: (channel) => set((state) => {
    const newState = {
      channel,
      sessionState: { ...state.sessionState, channel },
      analytics: { ...state.analytics, lastActivity: Date.now() },
    };
    return newState;
  }),

  setCustomer: (customer) => set((state) => ({
    customer,
    sessionState: { 
      ...state.sessionState, 
      customer: customer || undefined, 
      customerId: customer?.id 
    },
    analytics: { ...state.analytics, lastActivity: Date.now() },
  })),

  addMessage: (message) => set((state) => {
    const cartValue = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      messages: [...state.messages, message],
      analytics: {
        ...state.analytics,
        conversationSteps: state.analytics.conversationSteps + 1,
        cartValue,
        lastActivity: Date.now(),
      },
    };
  }),

  updateCart: (cart) => set((state) => {
    const cartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      cart,
      sessionState: { ...state.sessionState, cart },
      analytics: { ...state.analytics, cartValue, lastActivity: Date.now() },
    };
  }),

  addToCart: (item) => set((state) => {
    const existingItem = state.cart.find(cartItem => cartItem.sku === item.sku);
    let newCart;
    
    if (existingItem) {
      newCart = state.cart.map(cartItem => 
        cartItem.sku === item.sku 
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
    } else {
      newCart = [...state.cart, item];
    }
    
    const cartValue = newCart.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0);
    
    return {
      cart: newCart,
      sessionState: { ...state.sessionState, cart: newCart },
      analytics: { ...state.analytics, cartValue, lastActivity: Date.now() },
    };
  }),

  removeFromCart: (sku) => set((state) => {
    const newCart = state.cart.filter(item => item.sku !== sku);
    const cartValue = newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      cart: newCart,
      sessionState: { ...state.sessionState, cart: newCart },
      analytics: { ...state.analytics, cartValue, lastActivity: Date.now() },
    };
  }),

  clearCart: () => set((state) => ({
    cart: [],
    sessionState: { ...state.sessionState, cart: [] },
    analytics: { ...state.analytics, cartValue: 0, lastActivity: Date.now() },
  })),

  updateSessionState: (newState) => set((state) => ({
    sessionState: { ...state.sessionState, ...newState },
    analytics: { ...state.analytics, lastActivity: Date.now() },
  })),

  trackAgentUsage: (agent) => set((state) => ({
    analytics: {
      ...state.analytics,
      agentUsage: {
        ...state.analytics.agentUsage,
        [agent]: (state.analytics.agentUsage[agent] || 0) + 1,
      },
      lastActivity: Date.now(),
    },
    ui: { ...state.ui, currentAgent: agent },
  })),

  setTyping: (isTyping, agent = '') => set((state) => ({
    ui: { ...state.ui, isTyping, currentAgent: agent },
  })),

  resetSession: () => set({
    sessionId: `SESSION_${Date.now()}`,
    messages: [],
    cart: [],
    sessionState: {
      cart: [],
      context: [],
      channel: 'web',
    },
    analytics: {
      agentUsage: {},
      conversationSteps: 0,
      cartValue: 0,
      sessionStartTime: Date.now(),
      lastActivity: Date.now(),
    },
  }),

  getCartTotal: () => {
    const state = get();
    return state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getSessionDuration: () => {
    const state = get();
    return Math.floor((Date.now() - state.analytics.sessionStartTime) / 1000);
  },
}), {
  name: 'abfrl-session',
  partialize: (state) => ({
    sessionId: state.sessionId,
    channel: state.channel,
    customer: state.customer,
    cart: state.cart,
    analytics: state.analytics,
  }),
}));
