import React, { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Edit2, AlertCircle } from 'lucide-react';
import MenuList from '../components/menu/MenuList';
import AddItemModal from '../components/menu/AddItemModal';
import BulkUploadModal from '../components/menu/BulkUploadModal';

interface Category {
  _id: string;
  label: string;
  restaurant: string;
  externalId: string;
  active: boolean;
  createdAt: string;
  order_sequence: number;
  tags: string[];
  images: string[];
  __v: number;
}

const MenuManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://node.api.dash.thriftyai.in/menu/categories/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('Authentication token expired or invalid');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        setCategories(data);
      } else if (data && data.data && Array.isArray(data.data)) {
        setCategories(data.data);
      } else if (data && data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        console.error('Unexpected data structure:', data);
        throw new Error('Invalid data format received from server');
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to load categories');
      
      if (err.message.includes('token')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryAdded = async () => {
    await fetchCategories();
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.label);
    setEditModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`https://node.api.dash.thriftyai.in/menu/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: newCategoryName.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      await fetchCategories(); // Refresh the list
      setEditModalOpen(false);
      setEditingCategory(null);
      setNewCategoryName('');
    } catch (err: any) {
      console.error('Error updating category:', err);
      setError(err.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`https://node.api.dash.thriftyai.in/menu/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      await fetchCategories(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Failed to delete category');
    }
  };

  const handleDeleteAllCategories = async () => {
    if (!window.confirm('Are you sure you want to delete all categories? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const deletePromises = categories.map(category => 
        fetch(`https://node.api.dash.thriftyai.in/menu/categories/${category._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      );

      await Promise.all(deletePromises);
      await fetchCategories(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting categories:', err);
      setError(err.message || 'Failed to delete categories');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Item
          </button>
          <button 
            onClick={() => setShowBulkUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Upload className="h-5 w-5" />
            Bulk Upload
          </button>
          <button 
            onClick={handleDeleteAllCategories}
            disabled={isDeleting || categories.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300"
          >
            <Trash2 className="h-5 w-5" />
            Delete All Categories
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading categories...</p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === null 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories
              .filter(category => category.active)
              .sort((a, b) => a.order_sequence - b.order_sequence)
              .map((category) => (
                <div key={category._id} className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCategory(category._id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                      selectedCategory === category._id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title="Edit category"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>

          <MenuList categories={categories} selectedCategory={selectedCategory} />
        </>
      )}

      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)} 
          categories={categories}
          onCategoryAdded={handleCategoryAdded}
        />
      )}

      {showBulkUploadModal && (
        <BulkUploadModal
          onClose={() => setShowBulkUploadModal(false)}
          onSuccess={handleCategoryAdded}
        />
      )}

      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Category
            </h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category name"
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingCategory(null);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;