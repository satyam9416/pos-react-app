export type AddOn = {
  id: string;
  name: string;
  price: number;
  required?: boolean;
  maxSelections?: number;
};

export type AddOnGroup = {
  id: string;
  name: string;
  addOns: AddOn[];
  minSelections: number;
  maxSelections: number;
};

export type Variant = {
  id: string;
  name: string;
  price: number;
};

export type VariantGroup = {
  id: string;
  name: string;
  variants: Variant[];
  required: boolean;
};