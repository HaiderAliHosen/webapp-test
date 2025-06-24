import { useState } from 'react';
import { Murmur } from '../types';
import { formatDistanceToNow } from 'date-fns';

type Props = {
  murmur: Murmur;
  onLike: (murmurId: number) => Promise<void>;
};

export function MurmurCard({ murmur, onLike }: Props) {
  const [isLiking, setIsLiking] = useState(false);
  
  // Ensure we have valid numbers and booleans
  const likeCount = murmur.likes?.length || 0;
  const isLiked = murmur.isLiked ?? false;

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await onLike(murmur.id);
    } catch (error) {
      console.error('Error liking murmur:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex items-start space-x-3">
        <img 
          src={murmur.user?.avatar_url || '/default-avatar.png'} 
          alt={murmur.user?.username}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{murmur.user?.name}</span>
            <span className="text-gray-500">@{murmur.user?.username}</span>
            <span className="text-gray-400 text-sm">
              {formatDistanceToNow(new Date(murmur.created_at))} ago
            </span>
          </div>
          <p className="mt-1 mb-2">{murmur.content}</p>
          <div className="flex items-center space-x-4 text-gray-500">
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'hover:text-red-400'}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill={isLiked ? 'currentColor' : 'none'} 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              <span>{likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}