import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, Plus } from 'lucide-react';

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
  category: {
    _id: string;
    label: string;
  };
  translations?: {
    hi?: {
      label: string;
      description: string;
      tags: string[];
      ingredients: string[];
    };
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

interface FormData {
  itemname: string;
  label: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  tags: {
    en: string[];
    hi: string[];
  };
  category: string;
  images: string[];
  ingredients: string[];
  veg: boolean;
  variants: Array<{
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
  addons: Array<{
    label: string;
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
  price: string;
  maxSelection: string;
}

interface AddItemModalProps {
  onClose: () => void;
  categories: Category[];
  onCategoryAdded: () => void;
  editingItem?: MenuItem;
  onEditComplete?: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ 
  onClose, 
  categories, 
  onCategoryAdded,
  editingItem,
  onEditComplete 
}) => {
  const [formData, setFormData] = useState<FormData>({
    itemname: '',
    label: {
      en: '',
      hi: ''
    },
    description: {
      en: '',
      hi: ''
    },
    tags: {
      en: [],
      hi: []
    },
    category: '',
    images: [],
    ingredients: [],
    veg: false,
    variants: [],
    addons: [],
    price: '',
    maxSelection: '1'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        itemname: editingItem.itemname || '',
        label: {
          en: editingItem.label || '',
          hi: editingItem.translations?.hi?.label || ''
        },
        description: {
          en: editingItem.description || '',
          hi: editingItem.translations?.hi?.description || ''
        },
        tags: {
          en: editingItem.tags || [],
          hi: editingItem.translations?.hi?.tags || []
        },
        category: editingItem.category?._id || '',
        images: editingItem.images || [],
        ingredients: editingItem.ingredients || [],
        veg: editingItem.veg || false,
        variants: editingItem.configs?.[0]?.contents || [],
        addons: editingItem.configs?.slice(1) || [],
        price: editingItem.configs?.[0]?.contents?.[0]?.value?.toString() || '',
        maxSelection: editingItem.configs?.[0]?.maxSelection?.toString() || '1'
      });
    }
  }, [editingItem]);

  const createMenuItem = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const itemData = {
        itemname: formData.label.en,
        label: formData.label.en,
        description: formData.description.en,
        images: formData.images,
        tags: formData.tags.en,
        ingredients: formData.ingredients,
        veg: formData.veg,
        category: formData.category,
        state: "active",
        configs: [
          {
            label: "Variants",
            dialog: formData.description.en || formData.label.en,
            maxSelection: parseInt(formData.maxSelection),
            required: true,
            contents: formData.variants.length > 0 ? formData.variants : [{
              label: formData.label.en,
              value: parseFloat(formData.price),
              recommended: false,
              added: false,
              translations: {
                hi: {
                  label: formData.label.hi
                }
              },
              conditions: []
            }]
          },
          ...formData.addons
        ],
        translations: {
          hi: {
            label: formData.label.hi,
            description: formData.description.hi,
            tags: formData.tags.hi,
            ingredients: formData.ingredients
          }
        },
        charges: []
      };

      const url = editingItem 
        ? `https://node.api.dash.thriftyai.in/menu/items/${editingItem._id}`
        : 'https://node.api.dash.thriftyai.in/menu/items';

      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || data.message || 'Failed to save item');
      }

      if (editingItem && onEditComplete) {
        onEditComplete();
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving item:', err);
      setError(err.message || 'Failed to save item');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Item Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name (English)
                </label>
                <input
                  type="text"
                  value={formData.label.en}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    label: { ...prev.label, en: e.target.value }
                  }))}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name (Hindi)
                </label>
                <input
                  type="text"
                  value={formData.label.hi}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    label: { ...prev.label, hi: e.target.value }
                  }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (English)
                </label>
                <textarea
                  value={formData.description.en}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, en: e.target.value }
                  }))}
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Hindi)
                </label>
                <textarea
                  value={formData.description.hi}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, hi: e.target.value }
                  }))}
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Price and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full pl-8 p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.veg}
                      onChange={() => setFormData(prev => ({ ...prev, veg: true }))}
                      className="mr-2"
                    />
                    Veg
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!formData.veg}
                      onChange={() => setFormData(prev => ({ ...prev, veg: false }))}
                      className="mr-2"
                    />
                    Non-veg
                  </label>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Variants
                  </label>
                  <div className="mt-2">
                    <label className="block text-sm text-gray-600 mb-1">Max Selection</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxSelection}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxSelection: e.target.value }))}
                      className="w-24 p-2 border rounded-lg"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    variants: [...prev.variants, {
                      label: '',
                      value: 0,
                      recommended: false,
                      added: false,
                      translations: { hi: { label: '' } },
                      conditions: []
                    }]
                  }))}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Variant
                </button>
              </div>
              <div className="space-y-3">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="flex gap-4">
                    <input
                      type="text"
                      value={variant.label}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[index] = {
                          ...newVariants[index],
                          label: e.target.value,
                          translations: { hi: { label: e.target.value } }
                        };
                        setFormData(prev => ({ ...prev, variants: newVariants }));
                      }}
                      placeholder="Variant name"
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={variant.value}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants[index] = {
                            ...newVariants[index],
                            value: parseFloat(e.target.value) || 0
                          };
                          setFormData(prev => ({ ...prev, variants: newVariants }));
                        }}
                        placeholder="Price"
                        className="w-32 pl-8 p-2 border rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          variants: prev.variants.filter((_, i) => i !== index)
                        }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Addons */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Addons
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    addons: [...prev.addons, {
                      label: '',
                      maxSelection: 1,
                      required: false,
                      contents: []
                    }]
                  }))}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Addon Group
                </button>
              </div>
              <div className="space-y-6">
                {formData.addons.map((addon, addonIndex) => (
                  <div key={addonIndex} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex-1 mr-4">
                        <input
                          type="text"
                          value={addon.label}
                          onChange={(e) => {
                            const newAddons = [...formData.addons];
                            newAddons[addonIndex] = {
                              ...newAddons[addonIndex],
                              label: e.target.value
                            };
                            setFormData(prev => ({ ...prev, addons: newAddons }));
                          }}
                          placeholder="Addon group name"
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Max Selection</label>
                          <input
                            type="number"
                            min="1"
                            value={addon.maxSelection}
                            onChange={(e) => {
                              const newAddons = [...formData.addons];
                              newAddons[addonIndex] = {
                                ...newAddons[addonIndex],
                                maxSelection: parseInt(e.target.value) || 1
                              };
                              setFormData(prev => ({ ...prev, addons: newAddons }));
                            }}
                            className="w-24 p-2 border rounded-lg"
                          />
                        </div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={addon.required}
                            onChange={(e) => {
                              const newAddons = [...formData.addons];
                              newAddons[addonIndex] = {
                                ...newAddons[addonIndex],
                                required: e.target.checked
                              };
                              setFormData(prev => ({ ...prev, addons: newAddons }));
                            }}
                            className="mr-2"
                          />
                          Required
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              addons: prev.addons.filter((_, i) => i !== addonIndex)
                            }));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const newAddons = [...formData.addons];
                            newAddons[addonIndex] = {
                              ...newAddons[addonIndex],
                              contents: [...newAddons[addonIndex].contents, {
                                label: '',
                                value: 0,
                                recommended: false,
                                added: false,
                                translations: { hi: { label: '' } },
                                conditions: []
                              }]
                            };
                            setFormData(prev => ({ ...prev, addons: newAddons }));
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" /> Add Option
                        </button>
                      </div>
                      {addon.contents.map((content, contentIndex) => (
                        <div key={contentIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex gap-4">
                            <input
                              type="text"
                              value={content.label}
                              onChange={(e) => {
                                const newAddons = [...formData.addons];
                                newAddons[addonIndex].contents[contentIndex] = {
                                  ...newAddons[addonIndex].contents[contentIndex],
                                  label: e.target.value
                                };
                                setFormData(prev => ({ ...prev, addons: newAddons }));
                              }}
                              placeholder="Option name (English)"
                              className="flex-1 p-2 border rounded-lg"
                            />
                            <input
                              type="text"
                              value={content.translations.hi.label}
                              onChange={(e) => {
                                const newAddons = [...formData.addons];
                                newAddons[addonIndex].contents[contentIndex] = {
                                  ...newAddons[addonIndex].contents[contentIndex],
                                  translations: {
                                    hi: { label: e.target.value }
                                  }
                                };
                                setFormData(prev => ({ ...prev, addons: newAddons }));
                              }}
                              placeholder="Option name (Hindi)"
                              className="flex-1 p-2 border rounded-lg"
                            />
                          </div>
                          <div className="flex gap-4">
                            <input
                              type="number"
                              value={content.value}
                              onChange={(e) => {
                                const newAddons = [...formData.addons];
                                newAddons[addonIndex].contents[contentIndex] = {
                                  ...newAddons[addonIndex].contents[contentIndex],
                                  value: parseFloat(e.target.value) || 0
                                };
                                setFormData(prev => ({ ...prev, addons: newAddons }));
                              }}
                              placeholder="Price"
                              className="w-32 p-2 border rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newAddons = [...formData.addons];
                                newAddons[addonIndex].contents = newAddons[addonIndex].contents.filter(
                                  (_, i) => i !== contentIndex
                                );
                                setFormData(prev => ({ ...prev, addons: newAddons }));
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (English)
                </label>
                <input
                  type="text"
                  placeholder="Enter tags separated by commas"
                  value={formData.tags.en.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    tags: {
                      ...prev.tags,
                      en: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }
                  }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Hindi)
                </label>
                <input
                  type="text"
                  placeholder="Enter tags separated by commas"
                  value={formData.tags.hi.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    tags: {
                      ...prev.tags,
                      hi: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }
                  }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={createMenuItem}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {editingItem ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;