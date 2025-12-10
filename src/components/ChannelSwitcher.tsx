'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Monitor, MessageCircle, Tablet } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function ChannelSwitcher() {
  const { channel, setChannel, sessionId } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const channels = [
    { id: 'web' as const, icon: Monitor, label: 'Web' },
    { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
    { id: 'whatsapp' as const, icon: MessageCircle, label: 'WhatsApp' },
    { id: 'kiosk' as const, icon: Tablet, label: 'Kiosk' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-semibold mb-3 text-gray-700">Switch Channel</h3>
      <div className="grid grid-cols-2 gap-2">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setChannel(ch.id)}
            className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
              channel === ch.id
                ? 'bg-brand-secondary text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ch.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{ch.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Session: {mounted ? sessionId.slice(-8) : '••••••••'}
        </p>
        <p className="text-xs text-green-600 mt-1">✓ Context preserved</p>
      </div>
    </div>
  );
}
