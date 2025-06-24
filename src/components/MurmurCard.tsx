import { useState } from 'react';
import { Murmur } from '../types';
import { formatDistanceToNow } from 'date-fns';

type Props = {
  murmur: Murmur;
  onLike: (murmurId: number) => Promise<void>;
  onDelete?: (murmurId: number) => Promise<void>;
  showDelete?: boolean;
  onUsernameClick?: (userId: number | string) => void;
};

export function MurmurCard({ murmur, onLike, onDelete, showDelete, onUsernameClick }: Props) {
  const [isLiking, setIsLiking] = useState(false);

  const likeCount = murmur.likeCount ?? murmur.likes?.length ?? 0;
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
    <div className="relative border rounded-lg p-4 mb-4 bg-white shadow-sm">
      {showDelete && onDelete && (
        <button
          onClick={() => onDelete(murmur.id)}
          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-500"
          title="Delete murmur"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      <div className="flex items-start space-x-3">
        <img 
          src={murmur.user?.avatar_url || '/default-avatar.png'} 
          alt={murmur.user?.username}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <button
              className="font-semibold text-blue-600 hover:underline focus:outline-none"
              onClick={() => onUsernameClick?.(murmur.user.id)}
              title={`Go to ${murmur.user.username}'s profile`}
            >
              {murmur.user?.name}
            </button>
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
