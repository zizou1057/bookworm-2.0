export type BookStatus = 'unread' | 'reading' | 'read' | 'wishlist';
export type GroupType = 'category' | 'collection';

export interface Group {
  id: string;
  name: string;
  bookIds: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  pages: number;
  status: BookStatus;
  coverUrl: string;
  addedAt: string;
  progressPercent?: number;
  readPages?: number;
  startDate?: string;
  endDate?: string;
  rating?: number;
  genres?: string[];
  publishDate?: string;
}
