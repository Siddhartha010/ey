# Demo Scenarios for Hackathon Presentation

## Scenario 1: Premium Customer Journey (5 minutes)

**Setup**: Select "Vikram Singh" (Platinum tier, 7500 points)

**Script**:
1. **User**: "Hello"
   - *Shows personalized greeting with tier status*

2. **User**: "I need a formal outfit for a business meeting"
   - *Recommendation Agent activates*
   - *Shows premium formal wear with bundle suggestions*

3. **User**: "Check stock for LV011"
   - *Inventory Agent checks across stores*
   - *Shows availability at 2 stores*

4. **User**: "Add LV011 to cart"
   - *Cart updated*

5. **User**: "Also show me formal shoes"
   - *Recommendation Agent suggests LV006*

6. **User**: "Add LV006 to cart"

7. **User**: "Proceed to checkout"
   - *Loyalty Agent calculates 20% platinum discount*
   - *Shows points earning*

8. **User**: "Pay with Card"
   - *Payment Agent processes*
   - *May fail first time - demonstrates retry*

9. **User**: "Retry payment"
   - *Success*
   - *Fulfillment Agent schedules delivery*

**Key Highlights**:
- Personalization based on tier
- Multi-agent orchestration
- Bundle recommendations
- Error recovery
- Loyalty benefits

---

## Scenario 2: Omnichannel Experience (3 minutes)

**Setup**: Select "Ananya Iyer" (Silver tier)

**Script**:
1. Start on **Web Channel**
2. **User**: "Show me western wear"
   - *Browse products*

3. **User**: "Check stock for AB007"
   - *Shows availability*

4. **Switch to Mobile Channel**
   - *Context preserved*
   - *Session ID maintained*

5. **User**: "Add AB007 to cart"

6. **Switch to Kiosk Channel**
   - *Cart still has item*

7. **User**: "I'm at the store, I'll pay with cash"
   - *In-store purchase flow*
   - *Immediate fulfillment*

**Key Highlights**:
- Seamless channel switching
- Session continuity
- Context preservation
- Multi-channel support

---

## Scenario 3: First-Time Customer (2 minutes)

**Setup**: No customer selected (Guest mode)

**Script**:
1. **User**: "Hi, I'm looking for casual wear"
   - *Shows popular items*
   - *Prompts to sign up for benefits*

2. **User**: "Show me jeans"
   - *Recommendation Agent shows casual options*

3. **User**: "What discounts do I get?"
   - *Loyalty Agent explains tier benefits*
   - *Encourages sign-up*

4. **Select Customer**: "Rohan Gupta" (Bronze tier)

5. **User**: "Now check my benefits"
   - *Shows 5% bronze discount*
   - *Explains upgrade path*

**Key Highlights**:
- Guest experience
- Conversion tactics
- Loyalty program explanation
- Tier benefits

---

## Scenario 4: Post-Purchase Support (2 minutes)

**Setup**: Select any customer

**Script**:
1. **User**: "Track my order"
   - *Support Agent shows tracking info*
   - *Current location and ETA*

2. **User**: "The size doesn't fit, I want to return"
   - *Support Agent initiates return*
   - *Schedules pickup*
   - *Explains refund process*

3. **User**: "I want to give feedback"
   - *Support Agent collects feedback*
   - *Awards bonus points*

**Key Highlights**:
- Post-purchase engagement
- Easy returns
- Customer feedback loop
- Loyalty rewards for engagement

---

## Scenario 5: Out-of-Stock Handling (2 minutes)

**Setup**: Select any customer

**Script**:
1. **User**: "Check stock for LV001 in Hyderabad"
   - *Inventory Agent shows out of stock*

2. **Agent**: "Currently out of stock. Would you like similar products?"

3. **User**: "Yes, show alternatives"
   - *Recommendation Agent suggests similar items*

4. **User**: "Can you reserve it when available?"
   - *Fulfillment Agent creates reservation*

**Key Highlights**:
- Graceful failure handling
- Alternative suggestions
- Reservation system
- Customer retention

---

## Scenario 6: Bundle & Upsell (3 minutes)

**Setup**: Select "Meera Nair" (Gold tier, high AOV)

**Script**:
1. **User**: "I need ethnic wear for a wedding"
   - *Recommendation Agent shows premium ethnic*

2. **Agent**: "I have a complete wedding look bundle - Lehenga + Jewelry - Save 15%"

3. **User**: "Tell me more"
   - *Shows bundle details*
   - *Calculates savings*

4. **User**: "Add the bundle"

5. **Agent**: "Since you're a gold member, you might love our designer collection"
   - *Shows upsell items*

6. **User**: "Add designer handbag AP010"

7. **User**: "Checkout"
   - *High AOV demonstrated*
   - *Gold tier benefits applied*

**Key Highlights**:
- Bundle creation
- Upselling strategy
- High-value customer handling
- Personalized recommendations

---

## Admin Dashboard Demo (2 minutes)

**After running scenarios**:

1. Switch to **Dashboard View**

2. **Show**:
   - Conversation steps count
   - Agent usage bar chart
   - Agent distribution pie chart
   - Customer journey timeline
   - AOV calculation
   - Tier engagement

3. **Explain**:
   - Which agents were used most
   - Conversion funnel
   - Customer engagement metrics
   - Business insights

**Key Highlights**:
- Real-time analytics
- Agent orchestration visibility
- Business metrics
- Data-driven insights

---

## Quick Test Commands

For rapid testing during Q&A:

```
"Hello"
"Show me formal wear"
"Check stock for LV001"
"Add to cart"
"Proceed to checkout"
"Pay with UPI"
"Track my order"
"I want to return"
```

---

## Troubleshooting During Demo

**If payment fails**:
- This is intentional (20% failure rate)
- Say "Retry payment"
- Demonstrates error recovery

**If agent seems slow**:
- Simulated processing delays (200-800ms)
- Shows realistic API behavior

**If need to reset**:
- Refresh page
- Select new customer
- Start fresh scenario

---

## Presentation Tips

1. **Start with Architecture Slide**: Show agent diagram
2. **Run Scenario 1**: Full journey
3. **Run Scenario 2**: Omnichannel
4. **Show Dashboard**: Analytics
5. **Q&A**: Use quick test commands

**Time Allocation**:
- Architecture: 2 min
- Demo: 10 min
- Dashboard: 2 min
- Q&A: 6 min

**Total**: 20 minutes

---

## Key Messages to Emphasize

1. **Agentic AI**: Not a monolithic chatbot - intelligent orchestration
2. **Specialization**: Each agent has specific expertise
3. **Omnichannel**: True continuity across channels
4. **Sales Psychology**: Consultative, not transactional
5. **Enterprise-Ready**: Production-grade architecture
6. **Extensible**: Easy to add new agents
7. **Data-Driven**: Real-time analytics and insights

---

**Good luck with your presentation! 🚀**
