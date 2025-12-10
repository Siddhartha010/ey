# ABFRL AI-Driven Conversational Sales Platform

## 🎯 Overview

A production-grade, AI-powered omnichannel retail platform demonstrating **Agentic AI Architecture** where a central Sales Agent orchestrates multiple specialized Worker Agents to deliver a seamless, human-like sales journey.

## 🏗️ Architecture

### Agentic AI Design

```
┌─────────────────────────────────────────────────────────┐
│                   Central Sales Agent                    │
│              (Orchestrator & Intent Router)              │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│ Recommendation │  │  Inventory  │  │ Loyalty & Offers│
│     Agent      │  │    Agent    │  │      Agent      │
└────────────────┘  └─────────────┘  └─────────────────┘
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│    Payment     │  │ Fulfillment │  │  Post-Purchase  │
│     Agent      │  │    Agent    │  │  Support Agent  │
└────────────────┘  └─────────────┘  └─────────────────┘
```

### Worker Agents

1. **Recommendation Agent**: Personalized product suggestions, bundles, upselling
2. **Inventory Agent**: Real-time stock checking across multiple stores
3. **Loyalty & Offers Agent**: Dynamic discount calculation, points management
4. **Payment Agent**: Multi-method payment processing with retry logic
5. **Fulfillment Agent**: Delivery scheduling, store pickup, reservations
6. **Support Agent**: Returns, tracking, feedback collection

## 🚀 Features

### Omnichannel Experience
- **Web Chat**: Desktop browser experience
- **Mobile View**: Responsive mobile interface
- **WhatsApp Style**: Familiar messaging UI
- **In-Store Kiosk**: Touch-optimized retail mode

### Session Continuity
- Shared session ID across channels
- Context preservation during channel switching
- Persistent cart and conversation history

### Sales Psychology
- Consultative conversation flow
- Open-ended questions
- Proactive upselling and cross-selling
- Objection handling
- Personalized recommendations

### Admin Dashboard
- Real-time analytics
- Agent usage visualization
- Customer journey tracking
- AOV and conversion metrics

## 📦 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## 📊 Demo Flows

### Flow 1: Complete Purchase Journey
1. Select customer (e.g., Priya Sharma - Gold tier)
2. Say: "I'm looking for formal wear"
3. Recommendation Agent suggests products
4. Say: "Check stock for LV001"
5. Inventory Agent shows availability
6. Say: "Add LV001 to cart"
7. Say: "Proceed to checkout"
8. Loyalty Agent applies discounts
9. Say: "Pay with UPI"
10. Payment Agent processes (may fail first time - retry demo)
11. Fulfillment Agent arranges delivery

### Flow 2: Channel Switching
1. Start conversation on Web
2. Add items to cart
3. Switch to Kiosk mode
4. Continue conversation - context preserved
5. Complete purchase in-store

### Flow 3: Error Recovery
1. Add items to cart
2. Attempt payment
3. Payment fails (simulated)
4. Agent offers retry
5. Retry succeeds
6. Order confirmed

### Flow 4: Post-Purchase
1. Say: "Track my order"
2. Support Agent shows status
3. Say: "I want to return"
4. Support Agent initiates return

## 🎨 UI/UX Highlights

- **Premium Design**: ABFRL brand colors (black, gold, brown)
- **Responsive**: Works on all screen sizes
- **Accessible**: WCAG compliant
- **Smooth Animations**: Professional transitions
- **Real-time Updates**: Instant feedback

## 📈 Analytics Tracked

- Conversation steps
- Agent usage frequency
- Cart value (AOV)
- Customer tier engagement
- Channel preferences
- Conversion funnel

## 🧪 Mock Data

- **10+ Customer Profiles**: Various loyalty tiers
- **12 Products**: Across categories (formal, casual, ethnic)
- **5 Store Locations**: Multi-city inventory
- **Loyalty Rules**: Tier-based discounts
- **Payment Methods**: UPI, Card, Cash, POS

## 🔑 Key Differentiators

1. **True Agentic Architecture**: Not just a chatbot - intelligent orchestration
2. **Worker Agent Specialization**: Each agent has specific expertise
3. **Context Awareness**: Agents share session state
4. **Sales Psychology**: Consultative, not transactional
5. **Omnichannel Continuity**: Seamless channel switching
6. **Error Resilience**: Graceful failure handling
7. **Enterprise-Grade**: Production-ready code structure

## 🎯 Hackathon Readiness

- ✅ Fully functional dynamic website
- ✅ Modular, extensible architecture
- ✅ Clean, documented code
- ✅ Multiple demo flows
- ✅ Admin analytics dashboard
- ✅ Futuristic UI/UX
- ✅ Clear AI orchestration demonstration

## 📝 Code Structure

```
src/
├── agents/              # Worker Agents + Central Sales Agent
│   ├── SalesAgent.ts           # Orchestrator
│   ├── RecommendationAgent.ts
│   ├── InventoryAgent.ts
│   ├── LoyaltyAgent.ts
│   ├── PaymentAgent.ts
│   ├── FulfillmentAgent.ts
│   └── SupportAgent.ts
├── components/          # React Components
│   ├── ChatInterface.tsx
│   ├── ChannelSwitcher.tsx
│   ├── CustomerSelector.tsx
│   └── AdminDashboard.tsx
├── data/               # Mock APIs
│   ├── customers.ts
│   ├── products.ts
│   └── inventory.ts
├── lib/                # Utilities
│   └── store.ts        # Zustand state management
└── app/                # Next.js pages
    ├── layout.tsx
    ├── page.tsx
    └── globals.css
```

## 🚀 Deployment

```bash
# Build
npm run build

# Deploy to Vercel (recommended)
vercel deploy

# Or any Node.js hosting
npm start
```

## 🎓 Learning Points

This project demonstrates:
- Agentic AI design patterns
- Microservices architecture in frontend
- State management across components
- Omnichannel user experience
- Sales conversation design
- Real-time analytics
- Error handling and recovery
- TypeScript best practices

## 📞 Support

For hackathon queries or technical support, refer to inline code comments and architecture documentation.

---

**Built with ❤️ for ABFRL National Hackathon**

*Demonstrating the future of AI-powered retail*
