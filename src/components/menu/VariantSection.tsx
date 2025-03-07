import React from 'react';
import { Plus, Minus } from 'lucide-react';
import type { VariantGroup } from './types';

type VariantSectionProps = {
  variantGroups: VariantGroup[];
  onAddGroup: () => void;
  onUpdateGroup: (index: number, group: VariantGroup) => void;
  onRemoveGroup: (index: number) => void;
};

const VariantSection: React.FC<VariantSectionProps> = ({
  variantGroups,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup
}) => {
  const handleAddVariant = (groupIndex: number) => {
    const group = variantGroups[groupIndex];
    const newVariant = {
      id: Date.now().toString(),
      name: '',
      price: 0
    };
    
    onUpdateGroup(groupIndex, {
      ...group,
      variants: [...group.variants, newVariant]
    });
  };

  const handleRemoveVariant = (groupIndex: number, variantIndex: number) => {
    const group = variantGroups[groupIndex];
    onUpdateGroup(groupIndex, {
      ...group,
      variants: group.variants.filter((_, index) => index !== variantIndex)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Variants</h3>
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
        {variantGroups.map((group, groupIndex) => (
          <div key={group.id} className="bg-[#1E1E1E] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={group.name}
                onChange={(e) => onUpdateGroup(groupIndex, { ...group, name: e.target.value })}
                placeholder="Group Name (e.g., Size)"
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={group.required}
                onChange={(e) => onUpdateGroup(groupIndex, { ...group, required: e.target.checked })}
                className="rounded border-white/10 bg-[#2A2A2A]"
              />
              <label className="text-sm text-gray-400">Required selection</label>
            </div>

            <div className="space-y-3">
              {group.variants.map((variant, variantIndex) => (
                <div key={variant.id} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => {
                      const newVariants = [...group.variants];
                      newVariants[variantIndex] = { ...variant, name: e.target.value };
                      onUpdateGroup(groupIndex, { ...group, variants: newVariants });
                    }}
                    placeholder="Variant name"
                    className="flex-1 bg-[#2A2A2A] text-white rounded-lg px-3 py-1.5 border border-white/10"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => {
                      const newVariants = [...group.variants];
                      newVariants[variantIndex] = { ...variant, price: parseFloat(e.target.value) };
                      onUpdateGroup(groupIndex, { ...group, variants: newVariants });
                    }}
                    placeholder="Price"
                    className="w-24 bg-[#2A2A2A] text-white rounded-lg px-3 py-1.5 border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(groupIndex, variantIndex)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => handleAddVariant(groupIndex)}
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

export default VariantSection;