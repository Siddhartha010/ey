import { products, getProductsByTags } from '@/data/products';
import { Customer } from '@/data/customers';

export class RecommendationAgent {
  async getRecommendations(customer: Customer | null, context: string): Promise<any> {
    await this.simulateProcessing();
    
    const contextLower = context.toLowerCase();
    let categoryFilter = '';
    let priceRange = { min: 0, max: Infinity };
    
    // Detect category from context
    if (contextLower.includes('formal')) categoryFilter = 'formal';
    else if (contextLower.includes('casual')) categoryFilter = 'casual';
    else if (contextLower.includes('ethnic')) categoryFilter = 'ethnic';
    else if (contextLower.includes('footwear') || contextLower.includes('shoes')) categoryFilter = 'footwear';
    else if (contextLower.includes('accessories')) categoryFilter = 'accessories';
    
    // Detect price preferences
    const underMatch = contextLower.match(/under (\d+)/);
    const belowMatch = contextLower.match(/below (\d+)/);
    const maxMatch = contextLower.match(/max (\d+)/);
    
    if (underMatch) priceRange.max = parseInt(underMatch[1]);
    else if (belowMatch) priceRange.max = parseInt(belowMatch[1]);
    else if (maxMatch) priceRange.max = parseInt(maxMatch[1]);
    else if (contextLower.includes('budget') || contextLower.includes('cheap')) priceRange.max = 2000;
    else if (contextLower.includes('premium') || contextLower.includes('luxury')) priceRange.min = 5000;
    
    let filteredProducts = products;
    
    // Apply filters
    if (categoryFilter) {
      filteredProducts = products.filter(p => p.category === categoryFilter);
    }
    
    filteredProducts = filteredProducts.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    
    if (!customer) {
      return {
        products: filteredProducts.slice(0, 4),
        reasoning: `Showing ${categoryFilter || 'popular'} items for new customers. Sign up for personalized recommendations!`,
        categories: this.getAvailableCategories(),
      };
    }

    // Personalized recommendations
    let recommended = filteredProducts.length > 0 ? filteredProducts : getProductsByTags(customer.preferences);
    
    // Sort by customer preferences and tier
    recommended = this.sortByPreferences(recommended, customer);
    
    const bundles = this.createBundles(recommended, customer);

    let reasoning = `Based on your preference for ${customer.preferences.join(', ')} and ${customer.loyaltyTier} tier status`;
    if (priceRange.max < Infinity) {
      reasoning += ` - showing items under ₹${priceRange.max}`;
    }
    if (categoryFilter) {
      reasoning += ` in ${categoryFilter} category`;
    }
    
    return {
      products: recommended.slice(0, 4),
      bundles,
      reasoning,
      upsell: customer.avgOrderValue > 5000 && priceRange.max === Infinity ? products.find(p => p.price > 10000) : null,
      categories: this.getAvailableCategories(),
      totalProducts: recommended.length,
      appliedFilters: { category: categoryFilter, priceRange }
    };
  }

  private createBundles(products: any[], customer: Customer) {
    if (customer.preferences.includes('formal')) {
      return [{
        name: 'Complete Formal Look',
        items: ['LV001', 'VH008', 'LV006'],
        discount: 15,
        totalPrice: 8797,
      }];
    }
    return [];
  }

  private sortByPreferences(products: any[], customer: Customer) {
    return products.sort((a, b) => {
      // Prioritize customer preferences
      const aScore = customer.preferences.filter(pref => a.tags.includes(pref)).length;
      const bScore = customer.preferences.filter(pref => b.tags.includes(pref)).length;
      
      if (aScore !== bScore) return bScore - aScore;
      
      // Then by tier-appropriate pricing
      const tierMultiplier = customer.loyaltyTier === 'platinum' ? 2 : customer.loyaltyTier === 'gold' ? 1.5 : 1;
      const idealPrice = customer.avgOrderValue * tierMultiplier;
      
      return Math.abs(a.price - idealPrice) - Math.abs(b.price - idealPrice);
    });
  }
  
  private getAvailableCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    return categories.map(cat => ({
      name: cat,
      count: products.filter(p => p.category === cat).length,
      priceRange: {
        min: Math.min(...products.filter(p => p.category === cat).map(p => p.price)),
        max: Math.max(...products.filter(p => p.category === cat).map(p => p.price))
      }
    }));
  }

  private simulateProcessing() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
  }
}
