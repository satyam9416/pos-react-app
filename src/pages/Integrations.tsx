import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Integration {
  id: string;
  name: string;
  logo: string;
  status: 'Live' | 'Upcoming';
  type: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const integrations: Integration[] = [
  {
    id: 'petpooja',
    name: 'PetPooja',
    logo: '/src/assets/images/petpooja.jpg',
    status: 'Live',
    type: 'POS SYSTEMS',
    description: 'Connect your PetPooja account to sync menu items and orders.',
    bgColor: 'bg-red-50',
    textColor: 'text-red-800'
  },
  {
    id: 'kaso',
    name: 'Kaso',
    logo: '/src/assets/images/KASO.png',
    status: 'Live',
    type: 'POS SYSTEMS',
    description: 'Integrate with Kaso POS for seamless order management.',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800'
  },
  {
    id: 'bitsila',
    name: 'Bitsila',
    logo: '/logos/bitsila.png',
    status: 'Live',
    type: 'ONLINE ORDERING',
    description: 'Connect your Bitsila account for online order management.',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-800'
  }
];

const IntegrationCard: React.FC<{
  integration: Integration;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ integration, isSelected, onSelect }) => {
  const [formData, setFormData] = useState({
    externalService: integration.id,
    externalId: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://node.api.dash.thriftyai.in/integrations/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to connect integration');
      }

      toast.success(`Successfully connected to ${integration.name}`);
    } catch (error) {
      console.error('Integration error:', error);
      toast.error(`Failed to connect to ${integration.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`rounded-lg shadow-sm border overflow-hidden transition-all duration-300 ${integration.bgColor}`}>
      <div
        className="p-4 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={onSelect}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={integration.logo} 
                alt={`${integration.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className={`font-semibold ${integration.textColor}`}>{integration.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  integration.status === 'Live' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {integration.status}
                </span>
                <span className="text-xs text-gray-600">{integration.type}</span>
              </div>
            </div>
          </div>
          {isSelected ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
        </div>
      </div>

      {isSelected && (
        <div className="p-4 border-t border-gray-200 bg-white/50">
          <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                External Service
              </label>
              <input
                type="text"
                value={formData.externalService}
                onChange={(e) => setFormData({ ...formData, externalService: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                External ID
              </label>
              <input
                type="text"
                value={formData.externalId}
                onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
                placeholder="Enter your external ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !formData.externalId}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const RequestIntegrationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would typically send the request to your backend
      toast.success('Integration request submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit integration request');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Request New Integration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Integration Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Integration Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select type</option>
              <option value="POS SYSTEMS">POS Systems</option>
              <option value="ONLINE ORDERING">Online Ordering</option>
              <option value="DELIVERY">Delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Integrations: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Request Integration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            isSelected={selectedCard === integration.id}
            onSelect={() => setSelectedCard(selectedCard === integration.id ? null : integration.id)}
          />
        ))}
      </div>

      <RequestIntegrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Integrations; 