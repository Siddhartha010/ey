# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Web    │  │  Mobile  │  │ WhatsApp │  │  Kiosk   │       │
│  │  Chat    │  │   View   │  │   Style  │  │   Mode   │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       └─────────────┴──────────────┴─────────────┘              │
│                          │                                       │
│                  ┌───────▼────────┐                             │
│                  │  Session Store  │                             │
│                  │    (Zustand)    │                             │
│                  └───────┬────────┘                             │
└──────────────────────────┼──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    Agent Orchestration Layer                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Central Sales Agent                        │    │
│  │  • Intent Detection                                     │    │
│  │  • Context Management                                   │    │
│  │  • Agent Routing                                        │    │
│  │  • Response Synthesis                                   │    │
│  └────────────────────────────────────────────────────────┘    │
│                           │                                      │
│       ┌───────────────────┼───────────────────┐                │
│       │                   │                   │                 │
│  ┌────▼─────┐      ┌─────▼──────┐     ┌─────▼──────┐         │
│  │Recommend │      │ Inventory  │     │  Loyalty   │         │
│  │  Agent   │      │   Agent    │     │   Agent    │         │
│  └──────────┘      └────────────┘     └────────────┘         │
│       │                   │                   │                 │
│  ┌────▼─────┐      ┌─────▼──────┐     ┌─────▼──────┐         │
│  │ Payment  │      │Fulfillment │     │  Support   │         │
│  │  Agent   │      │   Agent    │     │   Agent    │         │
│  └──────────┘      └────────────┘     └────────────┘         │
└──────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                        Data Layer                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Customers │  │ Products │  │Inventory │  │ Loyalty  │       │
│  │   API    │  │   API    │  │   API    │  │  Rules   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└──────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Frontend Layer

#### Multi-Channel Interface
- **Web Chat**: Desktop-optimized conversational UI
- **Mobile View**: Touch-friendly responsive design
- **WhatsApp Style**: Familiar messaging experience
- **Kiosk Mode**: Large-screen in-store interface

#### Session Management
- Shared session ID across all channels
- Real-time state synchronization
- Context preservation during channel switches
- Cart persistence

### 2. Agent Orchestration Layer

#### Central Sales Agent (Orchestrator)

**Responsibilities**:
- Receive user messages
- Detect intent using pattern matching
- Maintain conversation context
- Route to appropriate Worker Agent
- Synthesize responses
- Track agent usage

**Intent Categories**:
- Greeting
- Browse/Recommendation
- Stock Check
- Add to Cart
- Checkout
- Payment
- Order Tracking
- Returns/Support

**Decision Flow**:
```
User Message → Intent Detection → Context Analysis → Agent Selection → Execute → Response
```

#### Worker Agents

##### Recommendation Agent
```typescript
Input: Customer profile, preferences, context
Process: 
  - Analyze purchase history
  - Match with product tags
  - Create bundles
  - Identify upsell opportunities
Output: Personalized product list, bundles, reasoning
```

##### Inventory Agent
```typescript
Input: SKU, preferred store
Process:
  - Query inventory database
  - Check multi-store availability
  - Calculate total stock
  - Determine status (In Stock/Limited/Out)
Output: Store-wise availability, recommendations
```

##### Loyalty Agent
```typescript
Input: Customer tier, cart value
Process:
  - Apply tier-based discount
  - Calculate additional offers
  - Compute points earned
  - Check redemption eligibility
Output: Discount breakdown, final amount, points
```

##### Payment Agent
```typescript
Input: Amount, payment method, retry count
Process:
  - Validate payment method
  - Simulate processing (with failure rate)
  - Generate transaction ID
  - Handle retry logic
Output: Success/failure, transaction details
```

##### Fulfillment Agent
```typescript
Input: Order ID, method (delivery/pickup/in-store)
Process:
  - Calculate delivery date
  - Generate tracking/reservation ID
  - Assign to store (if pickup)
Output: Fulfillment details, timeline
```

##### Support Agent
```typescript
Input: Support type (track/return/feedback)
Process:
  - Retrieve order status
  - Initiate return process
  - Collect feedback
  - Award bonus points
Output: Support resolution, next steps
```

### 3. Data Layer

#### Mock APIs

**Customers API**:
- 10+ synthetic profiles
- Loyalty tiers: Bronze, Silver, Gold, Platinum
- Purchase history
- Preferences
- Average order value

**Products API**:
- 12 products across categories
- SKU-based identification
- Multi-brand (Louis Philippe, Allen Solly, Van Heusen, etc.)
- Price, images, descriptions
- Tags for recommendation matching

**Inventory API**:
- 5 store locations
- Real-time stock levels
- Multi-store queries
- Stock status calculation

**Loyalty Rules**:
- Tier-based discounts (5-20%)
- Cart value bonuses
- Points earning (1 point per ₹100)
- Redemption thresholds

## Data Flow Examples

### Example 1: Product Recommendation Flow

```
1. User: "Show me formal wear"
   ↓
2. Sales Agent detects intent: "recommendation"
   ↓
3. Sales Agent calls Recommendation Agent
   ↓
4. Recommendation Agent:
   - Checks customer.preferences = ['formal']
   - Queries products with tag 'formal'
   - Creates bundle (shirt + trousers + shoes)
   - Identifies upsell (premium suit)
   ↓
5. Returns to Sales Agent
   ↓
6. Sales Agent synthesizes response
   ↓
7. Display to user with formatting
```

### Example 2: Checkout Flow

```
1. User: "Proceed to checkout"
   ↓
2. Sales Agent detects intent: "checkout"
   ↓
3. Sales Agent validates cart (not empty)
   ↓
4. Sales Agent calls Loyalty Agent
   ↓
5. Loyalty Agent:
   - Gets customer tier (Gold = 15%)
   - Calculates cart value
   - Applies tier discount
   - Adds cart value bonus (5% for >₹5000)
   - Calculates points earned
   ↓
6. Returns discount breakdown
   ↓
7. Sales Agent presents summary
   ↓
8. Awaits payment method selection
```

### Example 3: Channel Switch Flow

```
1. User on Web: Adds items to cart
   ↓
2. Session state stored in Zustand:
   - sessionId: "SESSION_123"
   - cart: [item1, item2]
   - context: [message history]
   ↓
3. User switches to Kiosk
   ↓
4. Same sessionId maintained
   ↓
5. Zustand rehydrates state
   ↓
6. Cart and context preserved
   ↓
7. User continues conversation seamlessly
```

## State Management

### Session State Structure

```typescript
{
  sessionId: string,
  customerId?: string,
  customer?: Customer,
  cart: CartItem[],
  intent?: string,
  context: string[],
  channel: 'web' | 'mobile' | 'whatsapp' | 'kiosk',
  analytics: {
    agentUsage: Record<string, number>,
    conversationSteps: number,
    cartValue: number
  }
}
```

### Message Structure

```typescript
{
  role: 'user' | 'assistant' | 'system',
  content: string,
  agentUsed?: string,
  timestamp: number
}
```

## Scalability Considerations

### Current Implementation (Demo)
- In-memory state management
- Synchronous agent calls
- Mock data APIs
- Single-user session

### Production Enhancements
- Redis for session storage
- Message queue for agent communication
- Real database integration
- Multi-user support
- WebSocket for real-time updates
- Agent load balancing
- Caching layer
- API rate limiting

## Security Considerations

### Current Implementation
- Client-side state only
- No authentication
- Mock payment processing

### Production Requirements
- JWT-based authentication
- Encrypted session storage
- PCI-DSS compliant payment
- HTTPS only
- Input sanitization
- Rate limiting
- CORS configuration
- Data encryption at rest

## Performance Optimization

### Current Implementation
- Simulated delays (200-800ms)
- Client-side rendering
- No caching

### Production Enhancements
- Server-side rendering (SSR)
- Edge caching (CDN)
- Database query optimization
- Agent response caching
- Lazy loading
- Code splitting
- Image optimization
- Compression

## Monitoring & Analytics

### Tracked Metrics
- Agent usage frequency
- Conversation steps
- Cart abandonment
- Channel preferences
- Average order value
- Customer tier distribution
- Error rates
- Response times

### Visualization
- Bar charts (agent usage)
- Pie charts (agent distribution)
- Timeline (customer journey)
- KPI cards (AOV, conversion)

## Extension Points

### Adding New Agents
1. Create agent class in `/src/agents/`
2. Implement async methods
3. Add intent detection in Sales Agent
4. Register in orchestration logic
5. Update analytics tracking

### Adding New Channels
1. Create UI component
2. Add channel type to store
3. Implement channel-specific styling
4. Update session state
5. Test context preservation

### Adding New Data Sources
1. Create API module in `/src/data/`
2. Define TypeScript interfaces
3. Implement query functions
4. Integrate with agents
5. Update mock data

## Technology Choices

### Why Next.js?
- Server-side rendering capability
- API routes for backend logic
- Excellent TypeScript support
- Production-ready optimizations
- Easy deployment

### Why Zustand?
- Lightweight (1KB)
- Simple API
- No boilerplate
- React hooks integration
- DevTools support

### Why TypeScript?
- Type safety
- Better IDE support
- Refactoring confidence
- Documentation through types
- Reduced runtime errors

### Why Tailwind CSS?
- Rapid development
- Consistent design system
- Small bundle size
- Responsive utilities
- Easy customization

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│           CDN (Vercel Edge)             │
│  • Static assets                        │
│  • Image optimization                   │
│  • Global distribution                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        Next.js Application              │
│  • SSR/SSG pages                        │
│  • API routes                           │
│  • Agent orchestration                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Data Layer (Future)             │
│  • PostgreSQL (customer/orders)         │
│  • Redis (sessions/cache)               │
│  • S3 (images/assets)                   │
└─────────────────────────────────────────┘
```

---

**This architecture demonstrates enterprise-grade thinking while maintaining hackathon simplicity.**
