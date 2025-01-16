import React from 'react';
import { Plus, Minus } from 'lucide-react';
import type { AddOnGroup } from './types';

type AddOnSectionProps = {
  addOnGroups: AddOnGroup[];
  onAddGroup: () => void;
  onUpdateGroup: (index: number, group: AddOnGroup) => void;
  onRemoveGroup: (index: number) => void;
};

const AddOnSection: React.FC<AddOnSectionProps> = ({
  addOnGroups,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup
}) => {
  const handleAddAddOn = (groupIndex: number) => {
    const group = addOnGroups[groupIndex];
    const newAddOn = {
      id: Date.now().toString(),
      name: '',
      price: 0
    };
    
    onUpdateGroup(groupIndex, {
      ...group,
      addOns: [...group.addOns, newAddOn]
    });
  };

  const handleRemoveAddOn = (groupIndex: number, addOnIndex: number) => {
    const group = addOnGroups[groupIndex];
    onUpdateGroup(groupIndex, {
      ...group,
      addOns: group.addOns.filter((_, index) => index !== addOnIndex)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Add-ons</h3>
        <button
          type="button"
          onClick={onAddGroup}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Group
        </button>
      </div>

      <div className="space-y-6">
        {addOnGroups.map((group, groupIndex) => (
          <div key={group.id} className="bg-[#1E1E1E] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={group.name}
                onChange={(e) => onUpdateGroup(groupIndex, { ...group, name: e.target.value })}
                placeholder="Group Name (e.g., Toppings)"
                className="bg-transparent text-white text-lg font-medium focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onRemoveGroup(groupIndex)}
                className="text-red-500 hover:text-red-400"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Min Selections</label>
                <input
                  type="number"
                  min="0"
                  value={group.minSelections}
                  onChange={(e) => onUpdateGroup(groupIndex, { ...group, minSelections: parseInt(e.target.value) })}
                  className="w-full bg-[#2A2A2A] text-white rounded-lg px-3 py-1.5 border border-white/10"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Selections</label>
                <input
                  type="number"
                  min="0"
                  value={group.maxSelections}
                  onChange={(e) => onUpdateGroup(groupIndex, { ...group, maxSelections: parseInt(e.target.value) })}
                  className="w-full bg-[#2A2A2A] text-white rounded-lg px-3 py-1.5 border border-white/10"
                />
              </div>
            </div>

            <div className="space-y-3">
              {group.addOns.map((addOn, addOnIndex) => (
                <div key={addOn.id} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={addOn.name}
                    onChange={(e) => {
                      const newAddOns = [...group.addOns];
                      newAddOns[addOnIndex] = { ...addOn, name: e.target.value };
                      onUpdateGroup(groupIndex, { ...group, addOns: newAddOns });
                    }}
                    placeholder="Add-on name"
                    className="flex-1 bg-[#2A2A2A] text-white rounded-lg px-3 py-1.5 border border-white/10"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={addOn.price}
                    onChange={(e) => {
                      const newAddOns = [...group.addOns];
                      newAddOns[addOnIndex] = { ...addOn, price: parseFloat(e.target.value) };
                      onUpdateGroup(groupIndex, { ...group, addOns: newAddOns });
                    }}
                    placeholder="Price"
                    className="w-24 bg-[#2A2A2A] text-white rounded-lg px-3 py-1.5 border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAddOn(groupIndex, addOnIndex)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => handleAddAddOn(groupIndex)}
                className="flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddOnSection;