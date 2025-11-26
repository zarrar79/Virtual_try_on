export interface Design {
  imageUrl: string;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  designs?: Design[];
}

export interface SelectedDesign {
  imageUrl: string;
  quantity: number;
  designIndex: number;
}

export interface Review {
  _id: string;
  user?: {
    name: string;
  };
  rating: number;
  comment: string;
}