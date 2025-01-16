import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, AlertCircle, Plus } from 'lucide-react';
import AddItemModal from './AddItemModal';

interface Category {
  _id: string;
  label: string;
}

interface MenuItem {
  _id: string;
  itemname: string;
  label: string;
  description: string;
  images: string[];
  tags: string[];
  ingredients: string[];
  veg: boolean;
  active: boolean;
  category: {
    _id: string;
    label: string;
  };
  configs: Array<{
    label: string;
    dialog: string;
    maxSelection: number;
    required: boolean;
    contents: Array<{
      label: string;
      value: number;
      recommended: boolean;
      added: boolean;
      translations: {
        hi: {
          label: string;
        };
      };
      conditions: any[];
    }>;
  }>;
}

interface MenuListProps {
  categories: Category[];
  selectedCategory: string | null;
}

const MenuList: React.FC<MenuListProps> = ({ categories, selectedCategory }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      setIsLoading(true);
      setError('');

      const response = await fetch('https://node.api.dash.thriftyai.in/menu/items/?paginate=0', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      // Check if data has the expected structure
      if (data && data.foodItems && Array.isArray(data.foodItems)) {
        setMenuItems(data.foodItems);
      } else if (Array.isArray(data)) {
        setMenuItems(data);
      } else {
        console.error('Unexpected data structure:', data);
        throw new Error('Invalid data format received from server');
      }
    } catch (err: any) {
      console.error('Error fetching menu items:', err);
      setError(err.message || 'Failed to fetch menu items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleDelete = async (itemId: string, itemName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      setIsDeleting(true);
      const response = await fetch(`https://node.api.dash.thriftyai.in/menu/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Remove the item from the local state
      setMenuItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err: any) {
      console.error('Error deleting item:', err);
      setError(err.message || 'Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleEditComplete = () => {
    setEditingItem(null);
    fetchMenuItems(); // Refresh the list
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL menu items? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      setIsLoading(true);
      setError('');

      const response = await fetch('https://node.api.dash.thriftyai.in/menu/items', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete all items');
      }

      // Clear the local state
      setMenuItems([]);
    } catch (err: any) {
      console.error('Error deleting all items:', err);
      setError(err.message || 'Failed to delete all items');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = selectedCategory && Array.isArray(menuItems)
    ? menuItems.filter(item => item.category?._id === selectedCategory)
    : menuItems || [];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedCategory 
              ? `Menu Items - ${categories.find(c => c._id === selectedCategory)?.label}` 
              : 'All Menu Items'}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2"
              disabled={isLoading}
            >
              <Trash2 className="h-5 w-5" />
              Delete All Items
            </button>
            <button
              onClick={() => setEditingItem({
                _id: '',
                itemname: '',
                label: '',
                description: '',
                images: [],
                tags: [],
                ingredients: [],
                veg: true,
                active: true,
                category: {
                  _id: '',
                  label: ''
                },
                configs: [{
                  label: 'Variants',
                  dialog: '',
                  maxSelection: 1,
                  required: true,
                  contents: [{
                    label: '',
                    value: 0,
                    recommended: false,
                    added: false,
                    translations: {
                      hi: {
                        label: ''
                      }
                    },
                    conditions: []
                  }]
                }]
              })}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add New Item
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading menu items...</p>
          </div>
        ) : (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(filteredItems) ? filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.label}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      )}
                      <p className="text-blue-600 font-medium mt-2">
                        ₹{item.configs?.[0]?.contents?.[0]?.value || '0'}
                      </p>
                      <p className="text-sm text-gray-500">Category: {item.category?.label}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        item.veg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.veg ? 'Veg' : 'Non-veg'}
                      </span>
                    </div>
                    {item.images?.[0] && (
                      <img
                        src={item.images[0]}
                        alt={item.label}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.active 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.active ? 'Available' : 'Unavailable'}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit item"
                      >
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id, item.label)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Delete item"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  No menu items found for this category
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {editingItem && (
        <AddItemModal 
          onClose={() => setEditingItem(null)}
          categories={categories}
          onCategoryAdded={() => {}}
          editingItem={editingItem}
          onEditComplete={handleEditComplete}
        />
      )}
    </div>
  );
};

export default MenuList;