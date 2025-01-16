import React from 'react';
import { Sun, Moon, Bell, Lock, Globe, Printer, CreditCard, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SettingsSection from '../components/settings/SettingsSection';
import ThemeToggle from '../components/settings/ThemeToggle';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      <SettingsSection
        title="Appearance"
        icon={theme === 'dark' ? Moon : Sun}
        description="Customize your interface preferences"
      >
        <ThemeToggle />
      </SettingsSection>

      <SettingsSection
        title="Notifications"
        icon={Bell}
        description="Configure how you receive alerts and notifications"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Order notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thrifty-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Email updates</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thrifty-500"></div>
            </label>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Security"
        icon={Lock}
        description="Manage your account security settings"
      >
        <button className="text-thrifty-400 hover:text-thrifty-300">
          Change password
        </button>
      </SettingsSection>

      <SettingsSection
        title="Language & Region"
        icon={Globe}
        description="Set your preferred language and regional settings"
      >
        <select className="bg-surface-light text-white border border-white/10 rounded-lg px-4 py-2 outline-none">
          <option value="en">English (US)</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </SettingsSection>

      <SettingsSection
        title="Printing"
        icon={Printer}
        description="Configure receipt and KOT printing settings"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Auto-print receipts</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thrifty-500"></div>
            </label>
          </div>
          <button className="text-thrifty-400 hover:text-thrifty-300">
            Configure printers
          </button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Payment Methods"
        icon={CreditCard}
        description="Manage accepted payment methods and integrations"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Accept credit cards</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thrifty-500"></div>
            </label>
          </div>
          <button className="text-thrifty-400 hover:text-thrifty-300">
            Configure payment gateways
          </button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Help & Support"
        icon={HelpCircle}
        description="Get help and contact support"
      >
        <div className="space-y-2">
          <button className="text-thrifty-400 hover:text-thrifty-300">
            View documentation
          </button>
          <button className="text-thrifty-400 hover:text-thrifty-300 block">
            Contact support
          </button>
        </div>
      </SettingsSection>
    </div>
  );
};

export default Settings;