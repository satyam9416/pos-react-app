import React from 'react';
import { LucideIcon } from 'lucide-react';

type Props = {
  title: string;
  icon: LucideIcon;
  description: string;
  children: React.ReactNode;
};

const SettingsSection: React.FC<Props> = ({ title, icon: Icon, description, children }) => {
  return (
    <div className="bg-surface-light rounded-xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 bg-surface rounded-lg">
          <Icon className="h-5 w-5 text-thrifty-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <div className="ml-12">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;