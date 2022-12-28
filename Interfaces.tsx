export interface Review {
  createdAt: Date;
  description: string;
  photo: string;
  productID: string;
  rating: number;
  tags: Tag[];
  userID: string;
  id?: string;
}

export interface Tag {
  name: string;
}

export interface Product {
  brand: string;
  description: string;
  flavor: string[];
  format: string;
  manufacturer: string;
  name: string;
  nicotine: number;
  photo: string;
  pouches: number;
  reviews: string[];
  strength: number;
  tags: Tag[];
  type: string;
  weigth: number;
}

export interface User {
  id: string;
  createdAt: Date;
  displayName: string;
  email: string;
  photo: string;
  liked: string[];
  reviews: string[];
  grade: number;
}
