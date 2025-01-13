export interface MediaItem {
  url: string;
  description: string;
  type: 'image' | 'video';
}

export interface Project {
  id: string;
  title: string;
  categories: string[];
  description: string;
  year: number;
  thumbnail: string;
  coverImage: string;
  media: MediaItem[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}