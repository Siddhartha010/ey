import { checkInventory } from '@/data/inventory';

export class InventoryAgent {
  async checkStock(sku: string, preferredStore?: string): Promise<any> {
    await this.simulateProcessing();
    
    const stockData = checkInventory(sku, preferredStore);
    const totalStock = stockData.reduce((sum, item) => sum + item.quantity, 0);

    if (totalStock === 0) {
      return {
        available: false,
        message: 'Currently out of stock across all stores',
        alternatives: 'Would you like me to suggest similar products?',
      };
    }

    const inStock = stockData.filter(s => s.quantity > 0);
    
    return {
      available: true,
      stores: inStock.map(s => ({
        storeId: s.storeId,
        storeName: s.storeName,
        location: s.location,
        quantity: s.quantity,
        status: s.quantity > 10 ? 'In Stock' : 'Limited Stock',
      })),
      totalAvailable: totalStock,
      recommendation: inStock[0]?.storeName,
    };
  }

  private simulateProcessing() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}
