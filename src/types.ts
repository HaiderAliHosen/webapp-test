export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  bio?: string | null;
  created_at: string | Date;
};

export type Murmur = {
  id: number;
  content: string;
  created_at: string | Date;
  updated_at: string | Date;
  user: User;
  likes: Like[];
  likeCount: number;
  isLiked?: boolean;
};

export type Like = {
  user_id: number;
  murmur_id?: number; // Made optional
  created_at?: string | Date; // Made optional
  user?: User; // Made optional
};

// Optional: Consider adding API response types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status?: number;
};

// Optional: Paginated response type
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};