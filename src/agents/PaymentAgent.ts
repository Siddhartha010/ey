export class PaymentAgent {
  async processPayment(amount: number, method: string, retryCount = 0): Promise<any> {
    await this.simulateProcessing();

    // Simulate 20% failure rate on first attempt
    const shouldFail = retryCount === 0 && Math.random() < 0.2;

    if (shouldFail) {
      return {
        success: false,
        error: 'Payment gateway timeout',
        message: 'Your payment could not be processed. Would you like to retry or try a different payment method?',
        retryable: true,
      };
    }

    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    return {
      success: true,
      transactionId,
      amount,
      method,
      timestamp: new Date().toISOString(),
      message: `Payment of ₹${amount} successful via ${method}`,
    };
  }

  async validatePaymentMethod(method: string): Promise<boolean> {
    const validMethods = ['UPI', 'Card', 'NetBanking', 'Wallet', 'POS', 'Cash'];
    return validMethods.includes(method);
  }

  private simulateProcessing() {
    return new Promise(resolve => setTimeout(resolve, 800));
  }
}
