import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';

interface BulkUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface Category {
  _id: string;
  label: string;
}

interface ProcessedItem {
  itemname: string;
  label: string;
  description: string;
  images: string[];
  tags: string[];
  ingredients: string[];
  veg: boolean;
  category: string;
  state: string;
  configs: Array<{
    label: string;
    dialog: string;
    maxSelection: number;
    required: boolean;
    contents: Array<{
      label: string;
      value: number;
      recommended: boolean;
      added: false;
      translations: {
        hi: {
          label: string;
        };
      };
      conditions: any[];
    }>;
  }>;
  translations: {
    hi: {
      label: string;
      description: string;
      tags: string[];
      ingredients: string[];
    };
  };
  charges: any[];
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categoryFile, setCategoryFile] = useState<File | null>(null);
  const [itemsFile, setItemsFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://node.api.dash.thriftyai.in/menu/categories/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data.data && Array.isArray(data.data)) {
        setCategories(data.data);
      } else if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories. Please try again.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        setError('Please upload a CSV file');
        return;
      }
      setCategoryFile(file);
      setError('');
    }
  };

  const handleItemsFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        setError('Please upload a CSV file');
        return;
      }
      setItemsFile(file);
      setError('');
    }
  };

  const processCategories = async (file: File) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          try {
            // Assuming first row is headers and category name is in first column
            const categories = results.data
              .slice(1) // Skip header row
              .filter((row: any) => row[0] && row[0].trim()) // Filter out empty rows
              .map((row: any) => {
                const label = String(row[0]).trim();
                // Create a unique externalId based on the label and timestamp
                const externalId = `${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
                
                const categoryData = {
                  label,
                  externalId
                };
                console.log('Processed category:', categoryData); // Debug log
                return categoryData;
              });
            resolve(categories);
          } catch (err) {
            reject(new Error('Failed to process CSV file'));
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const uploadCategories = async () => {
    if (!categoryFile) {
      setError('Please select a CSV file');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const categories = await processCategories(categoryFile);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      let successCount = 0;
      let failureCount = 0;
      const failedCategories: string[] = [];

      for (const category of categories) {
        try {
          // Create the request body with label and externalId
          const requestBody = {
            label: category.label,
            externalId: category.externalId
          };
          
          console.log('Sending category request with body:', JSON.stringify(requestBody));
          
          const response = await fetch('https://node.api.dash.thriftyai.in/menu/categories', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          const data = await response.json();
          console.log('API Response:', data);

          if (!response.ok) {
            throw new Error(data.error?.message || data.message || `Failed to create category: ${category.label}`);
          }

          successCount++;
          // Add a small delay between requests to avoid timestamp collisions
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err: any) {
          failureCount++;
          failedCategories.push(category.label);
          console.error(`Failed to create category: ${category.label}`, err);
        }
      }

      if (failureCount > 0) {
        setError(`Failed categories: ${failedCategories.join(', ')}`);
      }

      setSuccess(`Successfully created ${successCount} categories. ${failureCount > 0 ? `Failed to create ${failureCount} categories.` : ''}`);
      
      if (successCount > 0) {
        onSuccess(); // Refresh categories list
        setStep(2); // Move to next step
      }
    } catch (err: any) {
      console.error('Error uploading categories:', err);
      setError(err.message || 'Failed to upload categories');
    } finally {
      setIsLoading(false);
    }
  };

  const processItems = async (file: File): Promise<ProcessedItem[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true, // This will use the first row as headers
        skipEmptyLines: true,
        complete: (results) => {
          try {
            console.log('CSV Headers:', results.meta.fields);
            console.log('CSV Data:', results.data);

            const items: ProcessedItem[] = results.data
              .filter((row: any) => row.label_en && row.label_en.trim())
              .map((row: any) => {
                // Find category ID by label
                if (!Array.isArray(categories)) {
                  throw new Error('Categories not loaded properly');
                }
                const category = categories.find(cat => 
                  cat.label.toLowerCase() === row.category_label?.toLowerCase()
                );
                if (!category) {
                  throw new Error(`Category not found: ${row.category_label}`);
                }

                // Process variants
                let variants = [];
                if (row.variants) {
                  variants = row.variants.split('|').map((variant: string) => {
                    const [variantLabel, variantPrice] = variant.split(':').map((v: string) => v.trim());
                    return {
                      label: variantLabel,
                      value: parseFloat(variantPrice) || 0,
                      recommended: false,
                      added: false,
                      translations: {
                        hi: {
                          label: variantLabel
                        }
                      },
                      conditions: []
                    };
                  });
                }

                // If no variants specified, use item name and base price as the variant
                if (variants.length === 0) {
                  if (!row.base_price) {
                    throw new Error(`Base price is required for item: ${row.label_en}`);
                  }
                  variants = [{
                    label: "Regular",
                    value: parseFloat(row.base_price),
                    recommended: false,
                    added: false,
                    translations: {
                      hi: {
                        label: "रेगुलर"
                      }
                    },
                    conditions: []
                  }];
                } else {
                  // If variants are specified, ensure the first variant uses the base price
                  variants[0] = {
                    ...variants[0],
                    value: parseFloat(row.base_price) || variants[0].value
                  };
                }

                // Process addons if present
                let addons = [];
                if (row.addons) {
                  addons = row.addons.split('|').map((addon: string) => {
                    const [addonLabel, addonPrice] = addon.split(':').map((a: string) => a.trim());
                    return {
                      label: addonLabel,
                      maxSelection: 1,
                      required: false,
                      contents: [{
                        label: addonLabel,
                        value: parseFloat(addonPrice) || 0,
                        recommended: false,
                        added: false,
                        translations: {
                          hi: {
                            label: addonLabel
                          }
                        },
                        conditions: []
                      }]
                    };
                  });
                }

                // Create the item object in the required format
                const itemData: ProcessedItem = {
                  itemname: row.label_en,
                  label: row.label_en,
                  description: row.description_en || '',
                  images: row.image_url ? [row.image_url] : [],
                  tags: row.tags_en ? row.tags_en.split(',').map((tag: string) => tag.trim()) : [],
                  ingredients: [],
                  veg: row.veg?.toLowerCase() === 'true',
                  category: category._id,
                  state: "active",
                  configs: [
                    {
                      label: "Variants",
                      dialog: row.description_en || row.label_en,
                      maxSelection: 1,
                      required: true,
                      contents: variants
                    },
                    ...addons
                  ],
                  translations: {
                    hi: {
                      label: row.label_hi || row.label_en,
                      description: row.description_hi || row.description_en || '',
                      tags: row.tags_hi ? row.tags_hi.split(',').map((tag: string) => tag.trim()) : [],
                      ingredients: []
                    }
                  },
                  charges: []
                };

                return itemData;
              });
            resolve(items);
          } catch (err: any) {
            reject(new Error(err.message || 'Failed to process CSV file'));
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const uploadItems = async () => {
    if (!itemsFile) {
      setError('Please select a CSV file');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const items = await processItems(itemsFile);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Sending bulk items request with body:', JSON.stringify(items));
      
      const response = await fetch('https://node.api.dash.thriftyai.in/menu/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items)
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error?.message || data.message || 'Failed to create items');
      }

      setSuccess(`Successfully uploaded ${items.length} items.`);
      onSuccess(); // Refresh the items list
    } catch (err: any) {
      console.error('Error uploading items:', err);
      setError(err.message || 'Failed to upload items');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Bulk Upload - Step {step}/2
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              {success}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Step 1: Upload Categories
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a CSV file containing categories. The first column should contain category names.
                </p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                    <Upload className="h-5 w-5" />
                    Choose CSV File
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCategoryFileUpload}
                      className="hidden"
                    />
                  </label>
                  {categoryFile && (
                    <span className="text-sm text-gray-600">
                      Selected: {categoryFile.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Skip
                </button>
                <button
                  onClick={uploadCategories}
                  disabled={!categoryFile || isLoading}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2"
                >
                  {isLoading ? 'Uploading...' : 'Upload Categories'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Step 2: Upload Menu Items
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a CSV file containing menu items with the following columns:
                  <br />
                  label_en, label_hi, description_en, description_hi, image_url, tags_en, tags_hi, veg (true/false), category_label, base_price, variants (name:price|name:price), addons (name:price|name:price)
                  <br />
                  <span className="text-gray-500">
                    Note: 
                    <br />
                    - Base price is required and will be used as the price for the first variant
                    <br />
                    - If no variants are specified, a "Regular" variant will be created with the base price
                    <br />
                    - Variants format example: "Small:199|Medium:299|Large:399" (first variant price will be overridden by base price)
                    <br />
                    - Addons format example: "Extra Cheese:50|Mushrooms:30|Olives:25"
                  </span>
                </p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                    <Upload className="h-5 w-5" />
                    Choose CSV File
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleItemsFileUpload}
                      className="hidden"
                    />
                  </label>
                  {itemsFile && (
                    <span className="text-sm text-gray-600">
                      Selected: {itemsFile.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Skip
                </button>
                <button
                  onClick={uploadItems}
                  disabled={!itemsFile || isLoading}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2"
                >
                  {isLoading ? 'Uploading...' : 'Upload Items'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal; 