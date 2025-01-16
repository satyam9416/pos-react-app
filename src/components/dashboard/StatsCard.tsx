import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';

type TimeRange = 'daily' | 'monthly' | 'yearly';

type StatsCardProps = {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isPositive = change > 0;

  return (
    <div className="bg-surface-light rounded-xl p-6 border border-surface-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-content-muted">{title}</span>
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 text-sm text-content-muted hover:text-content"
            >
              {timeRange}
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-surface rounded-lg shadow-lg border border-surface-hover py-1 min-w-[120px] z-10">
                <button 
                  onClick={() => { setTimeRange('daily'); setIsDropdownOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-surface-hover text-content-muted hover:text-content"
                >
                  Daily
                </button>
                <button 
                  onClick={() => { setTimeRange('monthly'); setIsDropdownOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-surface-hover text-content-muted hover:text-content"
                >
                  Monthly
                </button>
                <button 
                  onClick={() => { setTimeRange('yearly'); setIsDropdownOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-surface-hover text-content-muted hover:text-content"
                >
                  Yearly
                </button>
              </div>
            )}
          </div>
        </div>
        {icon}
      </div>
      
      <div className="text-2xl font-bold text-content mb-2">{value}</div>
      
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-primary-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
        <span className={`text-sm ${isPositive ? 'text-primary-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change}% vs last {timeRange.slice(0, -2)}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;