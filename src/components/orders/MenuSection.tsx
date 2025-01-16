import React, { useState, useEffect } from 'react';

interface MenuItem {
  _id: string;
  label: string;
  description: string;
  category: {
    _id: string;
    label: string;
  };
  active: boolean;
  veg: boolean;
  configs?: Array<{
    contents: Array<{
      value: string;
    }>;
  }>;
}

interface Category {
  _id: string;
  label: string;
  active: boolean;
}

type Props = {
  searchTerm: string;
  onItemSelect: (item: { id: string; name: string; price: number }) => void;
};

const MenuSection: React.FC<Props> = ({ searchTerm, onItemSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
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
          const errorText = await response.text();
          console.error('Categories API error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Categories API response:', data);

        if (data?.data?.categories) {
          setCategories(data.data.categories.filter((category: Category) => category.active));
        } else if (Array.isArray(data)) {
          setCategories(data.filter((category: Category) => category.active));
        } else if (data?.categories && Array.isArray(data.categories)) {
          setCategories(data.categories.filter((category: Category) => category.active));
        } else {
          console.error('Unexpected categories response structure:', data);
          throw new Error('Invalid categories data format received from server');
        }
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const url = selectedCategory !== 'all'
          ? `https://node.api.dash.thriftyai.in/menu/items?category=${selectedCategory}&paginate=0`
          : 'https://node.api.dash.thriftyai.in/menu/items?paginate=0';

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Menu items API error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          throw new Error(`Failed to fetch menu items: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Menu items API response:', data);

        let items: MenuItem[] = [];

        if (data?.data?.foodItems) {
          items = data.data.foodItems;
        } else if (data?.foodItems) {
          items = data.foodItems;
        } else if (data?.data?.items) {
          items = data.data.items;
        } else if (Array.isArray(data)) {
          items = data;
        } else {
          console.error('Unexpected menu items response structure:', data);
          throw new Error('Invalid menu items data format received from server');
        }

        // Filter active items and log the count
        const activeItems = items.filter((item: MenuItem) => item.active);
        console.log(`Found ${activeItems.length} active items out of ${items.length} total items`);
        setMenuItems(activeItems);

      } catch (err: any) {
        console.error('Error fetching menu items:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedCategory]);

  const filteredItems = menuItems.filter((item: MenuItem) => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Debug logging for render
  console.log('Current state:', {
    categories: categories.length,
    menuItems: menuItems.length,
    filteredItems: filteredItems.length,
    selectedCategory,
    isLoading,
    error
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const handleItemClick = (item: MenuItem) => {
    console.log('Selected item:', item);
    onItemSelect({
      id: item._id,
      name: item.label,
      price: parseFloat(item.configs?.[0]?.contents?.[0]?.value || '0')
    });
  };

  return (
    <div className="space-y-6">
      {/* Categories Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${selectedCategory === 'all'
              ? 'bg-emerald-600 text-white'
              : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#333333]'}`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setSelectedCategory(category._id)}
            className={`flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category._id
                ? 'bg-emerald-600 text-white'
                : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#333333]'}`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading menu items...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedCategory === 'all' ? (
            // Group items by category when showing all
            categories.map((category) => {
              const categoryItems = filteredItems.filter(item => item.category._id === category._id);
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={category._id} className="space-y-3">
                  <h3 className="text-lg font-medium text-white/90">{category.label}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categoryItems.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => handleItemClick(item)}
                        className="bg-[#2A2A2A] p-4 rounded-lg hover:bg-[#333333] transition-colors text-left group"
                      >
                        <div className="flex flex-col h-full">
                          <h4 className="text-white font-medium mb-1">{item.label}</h4>
                          {item.description && (
                            <p className="text-gray-400 text-sm mb-2 line-clamp-2">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-auto">
                            <p className="text-emerald-500">₹{item.configs?.[0]?.contents?.[0]?.value || '0'}</p>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              item.veg ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'
                            }`}>
                              {item.veg ? 'Veg' : 'Non-veg'}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Show items for selected category
            <div className="grid grid-cols-2 gap-3">
              {filteredItems.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleItemClick(item)}
                  className="bg-[#2A2A2A] p-4 rounded-lg hover:bg-[#333333] transition-colors text-left group"
                >
                  <div className="flex flex-col h-full">
                    <h4 className="text-white font-medium mb-1">{item.label}</h4>
                    {item.description && (
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-auto">
                      <p className="text-emerald-500">₹{item.configs?.[0]?.contents?.[0]?.value || '0'}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        item.veg ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'
                      }`}>
                        {item.veg ? 'Veg' : 'Non-veg'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!isLoading && filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No menu items found
        </div>
      )}
    </div>
  );
};

export default MenuSection;