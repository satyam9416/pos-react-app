import React from 'react';
import { Layout, Grid } from 'lucide-react';
import OutletSelector from './OutletSelector';
import SalesOverview from './SalesOverview';
import ZoneStatistics from './ZoneStatistics';
import Analytics from './Analytics';
import OrderStats from './OrderStats';
import ProductAnalytics from './ProductAnalytics';
import RevenueLoss from './RevenueLoss';
import ExpenseTracker from './ExpenseTracker';
import HelpSection from './HelpSection';
import Notifications from './Notifications';
import ComingSoon from './ComingSoon';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Layout className="h-8 w-8 text-starbucks-green mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Restaurant POS</h1>
            </div>
            <OutletSelector />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Sales Overview Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SalesOverview />
            </div>
            <div>
              <ZoneStatistics />
            </div>
          </section>

          {/* Analytics Section */}
          <section>
            <Analytics />
          </section>

          {/* Order and Product Statistics */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <OrderStats />
            <ProductAnalytics />
          </section>

          {/* Revenue Loss and Coming Soon Features */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RevenueLoss />
            </div>
            <div>
              <ComingSoon />
            </div>
          </section>

          {/* Expense Tracking */}
          <section>
            <ExpenseTracker />
          </section>

          {/* Help and Notifications */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <HelpSection />
            </div>
            <div>
              <Notifications />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;