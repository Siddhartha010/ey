import { Customer } from '@/data/customers';

export class LoyaltyAgent {
  async calculateOffers(customer: Customer | null, cartValue: number): Promise<any> {
    await this.simulateProcessing();

    if (!customer) {
      return {
        tierDiscount: 0,
        additionalDiscount: 0,
        totalDiscount: 0,
        finalAmount: cartValue,
        pointsEarned: 0,
        currentPoints: 0,
        newPoints: 0,
        discountAmount: 0,
        message: 'Sign up to unlock exclusive offers!',
        canRedeemPoints: false,
      };
    }

    const tierDiscounts: Record<string, number> = {
      bronze: 5,
      silver: 10,
      gold: 15,
      platinum: 20,
    };

    const baseDiscount = tierDiscounts[customer.loyaltyTier] || 0;
    let additionalDiscount = 0;
    let pointsEarned = Math.floor(cartValue / 100);

    // Volume discounts
    if (cartValue > 5000) additionalDiscount += 5;
    if (cartValue > 10000) additionalDiscount += 10;
    if (cartValue > 20000) additionalDiscount += 5; // Extra for high value

    const totalDiscount = baseDiscount + additionalDiscount;
    const discountAmount = (cartValue * totalDiscount) / 100;
    const finalAmount = cartValue - discountAmount;

    return {
      tierDiscount: baseDiscount,
      additionalDiscount,
      totalDiscount,
      finalAmount,
      pointsEarned,
      currentPoints: customer.loyaltyPoints,
      newPoints: customer.loyaltyPoints + pointsEarned,
      discountAmount,
      message: `As a ${customer.loyaltyTier.toUpperCase()} member, you save ₹${discountAmount.toFixed(0)}! You'll earn ${pointsEarned} points.`,
      canRedeemPoints: customer.loyaltyPoints >= 1000,
    };
  }

  private simulateProcessing() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }
}
