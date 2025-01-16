import React from 'react';
import { Clock, Sparkles } from 'lucide-react';

const FEATURES = [
  { name: 'Price Discovery', description: 'AI-powered price optimization' },
  { name: 'Order Free Sample', description: 'Try before you stock' },
  { name: 'Zero Investment Outlet', description: 'Start with minimal capital' }
];

const ComingSoon: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-starbucks-green to-starbucks-green-dark rounded-xl shadow-sm p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Coming Soon</h2>
        <Clock className="h-5 w-5 opacity-80" />
      </div>

      <div className="space-y-4">
        {FEATURES.map((feature) => (
          <div key={feature.name} className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4" />
              <h3 className="font-medium">{feature.name}</h3>
            </div>
            <p className="text-sm text-white/80">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoon;