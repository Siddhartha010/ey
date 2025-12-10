'use client';

import { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useStore } from '@/lib/store';
import { customers } from '@/data/customers';

export default function CustomerSelector() {
  const { customer, setCustomer } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-semibold mb-3 text-gray-700">Customer Profile</h3>
      
      {customer ? (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center text-white font-bold">
              {customer.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{customer.name}</p>
              <p className="text-xs text-gray-600">{customer.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-brand-secondary text-white px-2 py-1 rounded-full">
                  {customer.loyaltyTier.toUpperCase()}
                </span>
                <span className="text-xs text-gray-600">{customer.loyaltyPoints} pts</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setCustomer(null)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-secondary text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            <User className="w-4 h-4" />
            Select Customer
          </button>
          
          {isOpen && (
            <div className="max-h-64 overflow-y-auto space-y-1 border border-gray-200 rounded-lg p-2">
              {customers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCustomer(c);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                >
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-gray-600">{c.loyaltyTier} • {c.loyaltyPoints} pts</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
