import { RecommendationAgent } from './RecommendationAgent';
import { InventoryAgent } from './InventoryAgent';
import { LoyaltyAgent } from './LoyaltyAgent';
import { PaymentAgent } from './PaymentAgent';
import { FulfillmentAgent } from './FulfillmentAgent';
import { SupportAgent } from './SupportAgent';
import { Customer } from '@/data/customers';
import { getProductBySku, products } from '@/data/products';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  agentUsed?: string;
  timestamp: number;
}

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  brand: string;
}

export interface SessionState {
  customerId?: string;
  customer?: Customer;
  cart: CartItem[];
  intent?: string;
  context: string[];
  channel: string;
}

export class SalesAgent {
  private recommendationAgent = new RecommendationAgent();
  private inventoryAgent = new InventoryAgent();
  private loyaltyAgent = new LoyaltyAgent();
  private paymentAgent = new PaymentAgent();
  private fulfillmentAgent = new FulfillmentAgent();
  private supportAgent = new SupportAgent();

  async processMessage(message: string, session: SessionState): Promise<{ response: string; agentUsed: string; data?: any }> {
    const intent = this.detectIntent(message);
    session.intent = intent;
    session.context.push(message);

    switch (intent) {
      case 'greeting':
        return this.handleGreeting(session);
      
      case 'browse':
      case 'recommendation':
        return this.handleRecommendation(message, session);
      
      case 'check_stock':
        return this.handleInventoryCheck(message, session);
      
      case 'add_to_cart':
        return this.handleAddToCart(message, session);
      
      case 'checkout':
        return this.handleCheckout(session);
      
      case 'payment':
        return this.handlePayment(message, session);
      
      case 'track_order':
        return this.handleTracking(message, session);
      
      case 'return':
        return this.handleReturn(message, session);
      
      case 'remove_from_cart':
        return this.handleRemoveFromCart(message, session);
      
      case 'view_cart':
        return this.handleViewCart(session);
      
      case 'fulfillment':
        return this.handleFulfillment(message, session);
      
      case 'store_selection':
        return this.handleStoreSelection(message, session);
      
      case 'help':
        return this.handleHelp(session);
      
      default:
        return this.handleGeneral(message, session);
    }
  }

  private detectIntent(message: string): string {
    const lower = message.toLowerCase().trim();
    
    // Priority-based intent detection
    if (lower.match(/^(hello|hi|hey|good morning|good evening|welcome)/) && !lower.includes('add')) return 'greeting';
    
    // Cart operations (high priority)
    if (lower.match(/add.*(to cart|cart)|buy|purchase|take|get|i want|i'll take|select/)) return 'add_to_cart';
    if (lower.match(/remove|delete|clear cart|empty cart/)) return 'remove_from_cart';
    if (lower.match(/show.*cart|view cart|^cart$|what.*in.*cart|my cart/)) return 'view_cart';
    
    // Store/location selection
    if (lower.match(/phoenix|dlf|mumbai|delhi|bangalore|chennai|hyderabad|mall|store [12]|option [12]/)) return 'store_selection';
    
    // Fulfillment options
    if (lower.match(/delivery|home delivery|ship|deliver to|pickup|store pickup|reserve|book/)) return 'fulfillment';
    
    // Shopping flow
    if (lower.match(/stock|available|inventory|check.*for|availability/)) return 'check_stock';
    if (lower.match(/checkout|proceed|complete|finish|buy now/)) return 'checkout';
    if (lower.match (/payment|pay|upi|card|cash|wallet|retry|gpay|paytm|phonepe/)) return 'payment';
    
    // Browse and recommendations
    if (lower.match(/recommend|suggest|show|looking for|need|want to see|browse|products|categories|formal|casual|ethnic|accessories|footwear/)) return 'recommendation';
    
    // Support
    if (lower.match(/track|where is|delivery status|order status|my order/)) return 'track_order';
    if (lower.match(/return|refund|exchange|cancel/)) return 'return';
    if (lower.match(/help|what can you do|commands|options|assist/)) return 'help';
    
    return 'general';
  }

  private async handleGreeting(session: SessionState) {
    const greeting = session.customer 
      ? `Hello ${session.customer.name}! Welcome back to ABFRL. As a ${session.customer.loyaltyTier} member with ${session.customer.loyaltyPoints} points, you have exclusive offers waiting! What are you looking for today?`
      : `Welcome to ABFRL! I'm your personal shopping assistant. I can help you discover the perfect outfit, check availability, and make your shopping seamless. What brings you here today?`;
    
    return { response: greeting, agentUsed: 'SalesAgent' };
  }

  private async handleRecommendation(message: string, session: SessionState) {
    const result = await this.recommendationAgent.getRecommendations(session.customer || null, message);
    
    let response = `${result.reasoning}\n\nI've curated these for you:\n`;
    result.products.forEach((p: any, i: number) => {
      response += `\n${i + 1}. ${p.name} by ${p.brand} - ₹${p.price}`;
    });

    if (result.bundles?.length > 0) {
      response += `\n\n💎 Special Bundle: ${result.bundles[0].name} - Save ${result.bundles[0].discount}%!`;
    }

    if (result.upsell) {
      response += `\n\n✨ You might also love our premium ${result.upsell.name} - ₹${result.upsell.price}`;
    }

    response += `\n\nWould you like to check availability or add any to your cart?`;

    return { response, agentUsed: 'RecommendationAgent', data: result };
  }

  private async handleInventoryCheck(message: string, session: SessionState) {
    const skuMatch = message.match(/[A-Z]{2}\d{3}/);
    if (!skuMatch) {
      return { response: 'Could you specify which product you\'d like to check? You can mention the product code.', agentUsed: 'SalesAgent' };
    }

    const result = await this.inventoryAgent.checkStock(skuMatch[0]);
    
    if (!result.available) {
      return { 
        response: `${result.message} ${result.alternatives}`, 
        agentUsed: 'InventoryAgent',
        data: result 
      };
    }

    let response = `Great news! Available at ${result.stores.length} stores:\n`;
    result.stores.forEach((s: any) => {
      response += `\n📍 ${s.storeName} - ${s.status} (${s.quantity} units)`;
    });
    response += `\n\nWould you like to reserve it or proceed with home delivery?`;

    return { response, agentUsed: 'InventoryAgent', data: result };
  }

  private async handleAddToCart(message: string, session: SessionState) {
    const skuMatch = message.match(/[A-Z]{2}\d{3}/);
    let product = null;
    
    if (skuMatch) {
      product = getProductBySku(skuMatch[0]);
    } else {
      // Enhanced product matching
      const productName = message.toLowerCase();
      
      // First try exact name matching
      product = products.find(p => {
        const fullName = `${p.name} by ${p.brand}`.toLowerCase();
        return productName.includes(fullName) || fullName.includes(productName.replace('add', '').replace('to cart', '').trim());
      });
      
      // If not found, try partial matching
      if (!product) {
        product = products.find(p => {
          const nameWords = p.name.toLowerCase().split(' ');
          const brandMatch = productName.includes(p.brand.toLowerCase());
          const nameMatch = nameWords.filter(word => word.length > 3).some(word => productName.includes(word));
          
          return brandMatch && nameMatch;
        });
      }
    }
    
    if (product) {
      // Check stock first
      const stockResult = await this.inventoryAgent.checkStock(product.sku);
      
      if (!stockResult.available) {
        return {
          response: `❌ Sorry, ${product.name} is currently out of stock.\n\n${stockResult.alternatives}\n\nWould you like to see similar products?`,
          agentUsed: 'InventoryAgent'
        };
      }
      
      // Add to cart
      const existingItem = session.cart.find(item => item.sku === product!.sku);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        session.cart.push({
          sku: product.sku,
          name: product.name,
          price: product.price,
          quantity: 1,
          brand: product.brand
        });
      }
      
      // Dynamic response with recommendations
      const cartTotal = session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const loyaltyDiscount = session.customer ? await this.loyaltyAgent.calculateOffers(session.customer, cartTotal) : null;
      
      let response = `✅ **Added to Cart!**\n\n`;
      response += `🛍️ ${product.name} by ${product.brand}\n`;
      response += `💰 Price: ₹${product.price}\n`;
      response += `📦 Available at ${stockResult.stores.length} stores\n\n`;
      
      // Cart summary
      response += `🛒 **Your Cart (${session.cart.length} items)**\n`;
      session.cart.forEach((item, i) => {
        response += `${i + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}\n`;
      });
      
      response += `\n💳 Subtotal: ₹${cartTotal}`;
      if (loyaltyDiscount) {
        response += `\n🎯 ${session.customer?.loyaltyTier} Discount: ${loyaltyDiscount.totalDiscount}%`;
        response += `\n✨ **You Save: ₹${(cartTotal - loyaltyDiscount.finalAmount).toFixed(0)}**`;
      }
      
      // Smart recommendations for formal wear
      if (product.category === 'formal') {
        const complementItems = products.filter(p => 
          p.category === 'formal' && p.sku !== product.sku
        ).slice(0, 2);
        
        if (complementItems.length > 0) {
          response += `\n\n💡 **Complete your formal look:**\n`;
          complementItems.forEach(item => {
            response += `• ${item.name} - ₹${item.price}\n`;
          });
        }
      }
      
      response += `\n\n🚀 Ready to checkout or add more items?`;
      
      // Update session state cart
      session.sessionState = session.sessionState || { cart: [], context: [], channel: 'web' };
      session.sessionState.cart = session.cart;
      
      return { 
        response, 
        agentUsed: 'SalesAgent', 
        data: { cart: session.cart, cartTotal } 
      };
    }
    
    // Enhanced product search if not found
    const searchResults = products.filter(p => {
      const searchTerm = message.toLowerCase();
      return p.name.toLowerCase().includes(searchTerm) || 
             p.category.includes(searchTerm) ||
             p.tags.some(tag => searchTerm.includes(tag));
    }).slice(0, 3);
    
    if (searchResults.length > 0) {
      let response = `🔍 I found these similar products:\n\n`;
      searchResults.forEach((p, i) => {
        response += `${i + 1}. ${p.name} by ${p.brand} - ₹${p.price} (${p.sku})\n`;
      });
      response += `\nSay "Add [product name]" or "Add [SKU]" to add to cart!`;
      return { response, agentUsed: 'RecommendationAgent', data: { suggestions: searchResults } };
    }
    
    return { 
      response: '🔍 Product not found. Try "Show me products" to browse our collection!', 
      agentUsed: 'SalesAgent' 
    };
  }

  private async handleCheckout(session: SessionState) {
    if (session.cart.length === 0) {
      const recommendations = await this.recommendationAgent.getRecommendations(session.customer, 'popular');
      let response = '🛒 Your cart is empty! Let me show you some popular items:\n\n';
      recommendations.products.slice(0, 3).forEach((p: any, i: number) => {
        response += `${i + 1}. ${p.name} by ${p.brand} - ₹${p.price}\n`;
      });
      response += '\nSay "Add [item name]" to get started!';
      return { response, agentUsed: 'RecommendationAgent', data: recommendations };
    }

    // Calculate totals
    const cartValue = session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const loyaltyResult = await this.loyaltyAgent.calculateOffers(session.customer || null, cartValue);
    const deliveryFee = cartValue < 1999 ? 99 : 0;
    const discountedAmount = loyaltyResult?.finalAmount || cartValue;
    const finalTotal = discountedAmount + deliveryFee;

    let response = `🛍️ **CHECKOUT SUMMARY**\n\n`;
    
    // Customer info
    if (session.customer) {
      response += `👤 ${session.customer.name} (${session.customer.loyaltyTier.toUpperCase()})\n`;
      response += `🎯 ${session.customer.loyaltyPoints} points available\n\n`;
    }
    
    // Cart items with details
    response += `🛒 **ORDER DETAILS**\n`;
    session.cart.forEach((item, i) => {
      response += `${i + 1}. ${item.name}\n`;
      response += `   ${item.brand} • Qty: ${item.quantity} • ₹${item.price * item.quantity}\n`;
    });
    
    // Pricing breakdown
    response += `\n💰 **PRICING**\n`;
    response += `Subtotal: ₹${cartValue}\n`;
    
    if (session.customer && loyaltyResult?.totalDiscount > 0) {
      const discountAmount = loyaltyResult.discountAmount || (cartValue - discountedAmount);
      response += `${session.customer.loyaltyTier.toUpperCase()} Discount (${loyaltyResult.totalDiscount}%): -₹${discountAmount.toFixed(0)}\n`;
      if (loyaltyResult.additionalDiscount > 0) {
        response += `Volume Bonus: -₹${((cartValue * loyaltyResult.additionalDiscount) / 100).toFixed(0)}\n`;
      }
    }
    
    response += `Delivery: ${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}\n`;
    response += `\n💳 **TOTAL: ₹${finalTotal.toFixed(0)}**\n`;
    
    if (session.customer && loyaltyResult?.pointsEarned > 0) {
      response += `\n⭐ **LOYALTY REWARDS**\n`;
      response += `Current Points: ${loyaltyResult.currentPoints || session.customer.loyaltyPoints}\n`;
      response += `Points Earned: +${loyaltyResult.pointsEarned}\n`;
      response += `New Balance: ${(loyaltyResult.currentPoints || session.customer.loyaltyPoints) + loyaltyResult.pointsEarned} points\n`;
      
      if (loyaltyResult.canRedeemPoints) {
        response += `🎁 You can redeem points for discounts!\n`;
      }
    }
    
    // Payment options with visual appeal
    response += `\n💳 **PAYMENT OPTIONS**\n`;
    response += `📱 UPI (GPay/PhonePe/Paytm)\n`;
    response += `💳 Credit/Debit Card\n`;
    response += `💵 Cash on Delivery\n`;
    response += `💼 Digital Wallet\n\n`;
    response += `Choose your payment method to proceed!`;

    return { 
      response, 
      agentUsed: 'LoyaltyAgent', 
      data: { 
        ...loyaltyResult, 
        cart: session.cart, 
        deliveryFee, 
        finalTotal,
        breakdown: { subtotal: cartValue, discount: cartValue - loyaltyResult.finalAmount, delivery: deliveryFee }
      } 
    };
  }

  private async handlePayment(message: string, session: SessionState) {
    // Enhanced payment method detection
    const lower = message.toLowerCase();
    let method = 'UPI';
    
    if (lower.includes('card') || lower.includes('credit') || lower.includes('debit')) method = 'Card';
    else if (lower.includes('cash') || lower.includes('cod')) method = 'Cash';
    else if (lower.includes('wallet') || lower.includes('paytm') || lower.includes('amazon pay')) method = 'Wallet';
    else if (lower.includes('upi') || lower.includes('gpay') || lower.includes('phonepe')) method = 'UPI';
    
    // Calculate final amount
    const cartValue = session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const loyaltyResult = await this.loyaltyAgent.calculateOffers(session.customer || null, cartValue);
    const deliveryFee = cartValue < 1999 ? 99 : 0;
    const discountedAmount = loyaltyResult?.finalAmount || cartValue;
    const finalAmount = discountedAmount + deliveryFee;
    
    // Process payment with enhanced feedback
    let response = `💳 **Processing ${method} Payment...**\n\n`;
    response += `💰 Amount: ₹${finalAmount.toFixed(0)}\n`;
    response += `🔒 Secure payment gateway\n\n`;
    
    const result = await this.paymentAgent.processPayment(finalAmount, method);

    if (!result.success) {
      response += `❌ **Payment Failed**\n\n`;
      response += `${result.message}\n\n`;
      response += `💡 **Try Again:**\n`;
      response += `• "Retry payment"\n`;
      response += `• "Pay with UPI"\n`;
      response += `• "Pay with Card"\n`;
      response += `• "Cash on Delivery"\n\n`;
      response += `Your cart is saved - no worries! 😊`;
      
      return { response, agentUsed: 'PaymentAgent', data: result };
    }

    // Success flow with comprehensive details
    const fulfillmentType = session.channel === 'kiosk' ? 'pickup' : 'delivery';
    const fulfillment = await this.fulfillmentAgent.arrangeFulfillment(result.transactionId, fulfillmentType);
    
    response = `✅ **Payment Successful!**\n\n`;
    response += `💳 ${method} Payment: ₹${finalAmount.toFixed(0)}\n`;
    response += `💷 Transaction ID: ${result.transactionId}\n\n`;
    
    // Order summary
    response += `📦 **ORDER CONFIRMED**\n`;
    session.cart.forEach((item, i) => {
      response += `${i + 1}. ${item.name} x${item.quantity}\n`;
    });
    
    response += `\n${fulfillment.message}\n`;
    response += `📱 Tracking ID: ${fulfillment.trackingId}\n`;
    
    // Loyalty points update
    if (session.customer && loyaltyResult?.pointsEarned > 0) {
      response += `\n⭐ **Loyalty Update**\n`;
      response += `Points Earned: +${loyaltyResult.pointsEarned}\n`;
      response += `New Balance: ${session.customer.loyaltyPoints + loyaltyResult.pointsEarned} points\n`;
    }
    
    response += `\n🎉 **Thank you for shopping with ABFRL!**\n\n`;
    response += `💡 **What's Next?**\n`;
    response += `• "Track my order" - Check delivery status\n`;
    response += `• "Show me more products" - Continue shopping\n`;
    response += `• "My account" - View order history\n\n`;
    response += `We'll send SMS/Email confirmations shortly! 📧`;
    
    // Store cart items before clearing
    const orderItems = [...session.cart];
    
    // Clear cart and update customer points
    if (session.customer && loyaltyResult?.pointsEarned > 0) {
      session.customer.loyaltyPoints += loyaltyResult.pointsEarned;
      // Update the session state to reflect new points
      if (session.sessionState) {
        session.sessionState.customer = session.customer;
      }
    }
    session.cart = [];
    if (session.sessionState) {
      session.sessionState.cart = [];
    }

    return { 
      response,
      agentUsed: 'PaymentAgent',
      data: { 
        payment: result, 
        fulfillment, 
        orderValue: finalAmount,
        orderItems,
        pointsEarned: loyaltyResult.pointsEarned
      } 
    };
  }

  private async handleTracking(message: string, session: SessionState) {
    const result = await this.supportAgent.handleSupport('track', 'ORD123');
    
    return { 
      response: `Order Status: ${result.status}\nCurrent Location: ${result.location}\nExpected Delivery: ${new Date(result.estimatedDelivery).toLocaleDateString()}`,
      agentUsed: 'SupportAgent',
      data: result 
    };
  }

  private async handleReturn(message: string, session: SessionState) {
    const result = await this.supportAgent.handleSupport('return', 'ORD123', 'size issue');
    
    return { 
      response: result.message,
      agentUsed: 'SupportAgent',
      data: result 
    };
  }

  private async handleRemoveFromCart(message: string, session: SessionState) {
    const skuMatch = message.match(/[A-Z]{2}\d{3}/);
    
    if (message.includes('clear') || message.includes('empty')) {
      session.cart = [];
      return { response: '🗑️ Cart cleared! Ready for a fresh start?', agentUsed: 'SalesAgent' };
    }
    
    if (skuMatch) {
      const index = session.cart.findIndex(item => item.sku === skuMatch[0]);
      if (index > -1) {
        const removed = session.cart.splice(index, 1)[0];
        return { response: `❌ Removed ${removed.name} from cart.`, agentUsed: 'SalesAgent' };
      }
    }
    
    return { response: 'Which item would you like to remove? (Use product code like LV001)', agentUsed: 'SalesAgent' };
  }

  private async handleViewCart(session: SessionState) {
    if (session.cart.length === 0) {
      return { response: '🛒 Your cart is empty. Let me show you some great products!', agentUsed: 'SalesAgent' };
    }
    
    let response = '🛒 **YOUR CART**\n\n';
    let total = 0;
    
    session.cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      response += `${index + 1}. ${item.name} (${item.sku})\n   ${item.brand} • Qty: ${item.quantity} • ₹${itemTotal}\n\n`;
    });
    
    response += `💰 **Total: ₹${total}**\n\n`;
    response += `Ready to checkout? Or need to add/remove items?`;
    
    return { response, agentUsed: 'SalesAgent', data: { cart: session.cart, total } };
  }

  private async handleHelp(session: SessionState) {
    const response = `🤖 **I'm your AI Shopping Assistant!**\n\n` +
      `**What I can do:**\n` +
      `🛍️ "Show me formal wear" - Browse products\n` +
      `📦 "Check stock for LV001" - Check availability\n` +
      `🛒 "Add shirt to cart" - Add items\n` +
      `👀 "Show my cart" - View cart\n` +
      `💳 "Proceed to checkout" - Complete purchase\n` +
      `📱 "Track my order" - Order status\n` +
      `🔄 "Return item" - Returns & exchanges\n\n` +
      `**Try switching channels** (Web/Mobile/Kiosk) - your cart stays with you!\n\n` +
      `What would you like to do?`;
    
    return { response, agentUsed: 'SalesAgent' };
  }

  private async handleFulfillment(message: string, session: SessionState) {
    const lower = message.toLowerCase();
    
    if (lower.includes('delivery') || lower.includes('ship') || lower.includes('deliver')) {
      const response = `🚚 **Home Delivery Selected**\n\n` +
        `📦 We'll deliver to your registered address\n` +
        `⏰ Expected delivery: 2-3 business days\n` +
        `💰 Free delivery for orders above ₹1999\n\n` +
        `Ready to add LV001 to cart and proceed?`;
      
      return { response, agentUsed: 'FulfillmentAgent' };
    }
    
    if (lower.includes('pickup') || lower.includes('reserve') || lower.includes('store')) {
      const response = `🏪 **Store Pickup Selected**\n\n` +
        `📍 Choose your preferred store:\n` +
        `1. Phoenix Mall Mumbai (15 units available)\n` +
        `2. DLF Mall Delhi (12 units available)\n\n` +
        `💡 Item will be reserved for 24 hours\n\n` +
        `Which store would you prefer?`;
      
      return { response, agentUsed: 'FulfillmentAgent' };
    }
    
    return { 
      response: 'Would you prefer home delivery or store pickup?', 
      agentUsed: 'FulfillmentAgent' 
    };
  }

  private async handleStoreSelection(message: string, session: SessionState) {
    const lower = message.toLowerCase();
    let selectedStore = '';
    let reservationId = '';
    
    if (lower.includes('phoenix') || lower.includes('mumbai') || lower.includes('1')) {
      selectedStore = 'Phoenix Mall Mumbai';
      reservationId = 'RSV' + Math.random().toString(36).substr(2, 6).toUpperCase();
    } else if (lower.includes('dlf') || lower.includes('delhi') || lower.includes('2')) {
      selectedStore = 'DLF Mall Delhi';
      reservationId = 'RSV' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }
    
    if (selectedStore) {
      const response = `✅ **Reservation Confirmed!**\n\n` +
        `🏪 Store: ${selectedStore}\n` +
        `🏷️ Product: Premium Linen Shirt (LV001)\n` +
        `🔖 Reservation ID: ${reservationId}\n` +
        `⏰ Valid until: ${new Date(Date.now() + 24*60*60*1000).toLocaleDateString()} 6:00 PM\n\n` +
        `📱 You'll receive SMS confirmation shortly\n` +
        `💳 Pay at store or add to cart for online payment\n\n` +
        `Would you like to add this to cart or browse more items?`;
      
      return { 
        response, 
        agentUsed: 'FulfillmentAgent',
        data: { reservationId, store: selectedStore, product: 'LV001' }
      };
    }
    
    return { 
      response: 'Please choose Phoenix Mall Mumbai or DLF Mall Delhi for pickup.',
      agentUsed: 'FulfillmentAgent' 
    };
  }

  private handleGeneral(message: string, session: SessionState) {
    const suggestions = [
      '"Show me products"',
      '"Add to cart"', 
      '"Check my cart"',
      '"Help"'
    ];
    
    return { 
      response: `I can help you with shopping! Try saying:\n${suggestions.map(s => `• ${s}`).join('\n')}\n\nWhat interests you today?`,
      agentUsed: 'SalesAgent' 
    };
  }
}
