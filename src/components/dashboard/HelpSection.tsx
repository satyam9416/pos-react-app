import React from 'react';
import { HelpCircle, MessageSquare, PhoneCall, Bot } from 'lucide-react';

const HelpSection: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Need Quick Help?</h2>
        <HelpCircle className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="flex items-center gap-3 p-4 bg-starbucks-green text-white rounded-lg hover:bg-starbucks-green-dark transition-colors">
          <Bot className="h-5 w-5" />
          <div className="text-left">
            <h3 className="font-medium">AI Assistant</h3>
            <p className="text-sm text-white/80">24/7 Instant Help</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PhoneCall className="h-5 w-5" />
          <div className="text-left">
            <h3 className="font-medium">Request Callback</h3>
            <p className="text-sm text-white/80">Get expert support</p>
          </div>
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-4 w-4 text-gray-400" />
          <h3 className="font-medium text-gray-900">Common Questions</h3>
        </div>
        <ul className="space-y-2">
          <li>
            <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              How do I process refunds?
            </button>
          </li>
          <li>
            <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Setting up payment methods
            </button>
          </li>
          <li>
            <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Managing inventory
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HelpSection;