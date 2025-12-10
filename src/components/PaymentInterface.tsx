'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Wallet, Banknote, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentInterfaceProps {
  amount: number;
  onPaymentComplete: (method: string, success: boolean) => void;
  customerTier?: string;
}

export default function PaymentInterface({ amount, onPaymentComplete, customerTier = 'guest' }: PaymentInterfaceProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<'select' | 'processing' | 'complete' | 'failed'>('select');

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'GPay, PhonePe, Paytm',
      color: 'bg-green-500',
      discount: customerTier === 'platinum' ? 2 : 0,
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      color: 'bg-blue-500',
      discount: 0,
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Amazon Pay, Paytm Wallet',
      color: 'bg-purple-500',
      discount: customerTier === 'gold' ? 1 : 0,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: Banknote,
      description: 'Pay when you receive',
      color: 'bg-orange-500',
      discount: 0,
    },
  ];

  const processPayment = async (method: string) => {
    setSelectedMethod(method);
    setIsProcessing(true);
    setStep('processing');
    setProgress(0);

    // Simulate payment processing with realistic steps
    const steps = [
      { message: 'Initiating payment...', duration: 800 },
      { message: 'Verifying payment method...', duration: 1200 },
      { message: 'Processing transaction...', duration: 1500 },
      { message: 'Confirming payment...', duration: 1000 },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Simulate 20% failure rate for demo purposes
    const success = Math.random() > 0.2;
    
    setStep(success ? 'complete' : 'failed');
    setIsProcessing(false);
    
    setTimeout(() => {
      onPaymentComplete(method, success);
    }, 2000);
  };

  const getDiscountedAmount = (method: any) => {
    const discount = method.discount;
    return discount > 0 ? amount * (1 - discount / 100) : amount;
  };

  if (step === 'processing') {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Payment</h3>
          <p className="text-gray-600 mb-6">Secure transaction in progress...</p>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-500">
            {progress < 25 && 'Initiating payment...'}
            {progress >= 25 && progress < 50 && 'Verifying payment method...'}
            {progress >= 50 && progress < 75 && 'Processing transaction...'}
            {progress >= 75 && 'Confirming payment...'}
          </p>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Amount:</span>
              <span className="font-semibold">₹{amount.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Method:</span>
              <span className="font-semibold">{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">Your order has been confirmed</p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Transaction ID:</span>
              <span className="font-mono text-xs">TXN{Date.now().toString().slice(-8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Amount Paid:</span>
              <span className="font-semibold text-green-700">₹{amount.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'failed') {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Payment Failed</h3>
          <p className="text-gray-600 mb-4">Transaction could not be completed</p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-700">
              Payment gateway error. Please try again or use a different payment method.
            </p>
          </div>
          
          <button
            onClick={() => setStep('select')}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Payment Method</h3>
        <p className="text-gray-600">Secure and fast checkout</p>
        
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">₹{amount.toFixed(0)}</span>
          </div>
          {customerTier !== 'guest' && (
            <p className="text-sm text-purple-600 mt-1">
              🎉 {customerTier.toUpperCase()} member benefits applied!
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const discountedAmount = getDiscountedAmount(method);
          const savings = amount - discountedAmount;
          
          return (
            <button
              key={method.id}
              onClick={() => processPayment(method.id)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`${method.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                    <method.icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">{method.name}</h4>
                    <p className="text-sm text-gray-500">{method.description}</p>
                    {savings > 0 && (
                      <p className="text-xs text-green-600 font-medium">
                        Save ₹{savings.toFixed(0)} • {method.discount}% off
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {savings > 0 ? (
                    <div>
                      <p className="text-lg font-bold text-green-600">₹{discountedAmount.toFixed(0)}</p>
                      <p className="text-sm text-gray-400 line-through">₹{amount.toFixed(0)}</p>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-gray-800">₹{amount.toFixed(0)}</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
        <Shield className="w-4 h-4" />
        <span>Secured by 256-bit SSL encryption</span>
      </div>
    </div>
  );
}