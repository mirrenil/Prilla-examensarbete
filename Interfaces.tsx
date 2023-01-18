export interface Review {
  createdAt: Date;
  description: string;
  photo: string;
  productID: string;
  rating: number;
  tags: Tag[];
  userID: string;
  comments?: Comment[];
  likes: string[];
  id: string;
}

export interface Comment {
  text: string;
  authorID: string;
}

export interface Tag {
  name: string;
}

export interface User {
  createdAt: Date;
  displayName: string;
  email: string;
  id: string;
  photo: string;
  liked: string[];
  following: string[];
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
  weight: number;
  rating: number;
  id: string;
}

export interface ReviewComment {
  authorID: string;
  text: string;
}
