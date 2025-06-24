import { useState, useEffect } from 'react';
// import axios from 'axios';
import api from '../interceptors/api';

import { MurmurCard } from '../components/MurmurCard';
import { Pagination } from '../components/Pagination';
import { CreateMurmur } from '../components/CreateMurmur';
import { Murmur } from '../types';

export function Timeline() {
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    async function fetchMurmurs() {
      try {
        setIsRefreshing(true);
        const response = await api.get(`/api/murmurs?page=${page}`);
        // Check if response.data is an array (direct return) or has items property
        const murmursData = Array.isArray(response.data) ? response.data : response.data.items;
        setMurmurs(murmursData || []); // Fallback to empty array if undefined
        
        // Similarly handle totalPages
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error('Error fetching murmurs:', error);
        setMurmurs([]); // Ensure we always have an array
      } finally {
        setIsRefreshing(false);
      }
    }
    fetchMurmurs();
  }, [page]);

  const handleLike = async (murmurId: number) => {
    try {
      // First check if already liked locally to decide which endpoint to call
      const murmur = murmurs.find(m => m.id === murmurId);
      if (!murmur) return;

      const currentUserId = 1; // Replace with actual current user ID from your auth context
      const isLiked = murmur.likes.some(like => like.user_id === currentUserId);

      // Optimistic update
      setMurmurs(prev => prev.map(m => {
        if (m.id === murmurId) {
          return {
            ...m,
            likes: isLiked 
              ? m.likes.filter(like => like.user_id !== currentUserId)
              : [...m.likes, { user_id: currentUserId }],
            likeCount: isLiked ? m.likeCount - 1 : m.likeCount + 1
          };
        }
        return m;
      }));

      // Call appropriate endpoint based on current like status
      if (isLiked) {
        await api.delete(`/api/murmurs/${murmurId}/like`);
      } else {
        await api.post(`/api/murmurs/${murmurId}/like`);
      }
    } catch (error) {
      console.error('Error handling like:', error);
      // Revert optimistic update on error
      setMurmurs(prev => [...prev]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <CreateMurmur onCreated={() => setPage(1)} />
      
      {isRefreshing ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="space-y-4">
            {murmurs?.length > 0 ? (
              murmurs.map(murmur => (
                <MurmurCard 
                  key={murmur.id} 
                  murmur={murmur} 
                  onLike={handleLike} 
                />
              ))
            ) : (
              <div className="text-center py-8">No murmurs found</div>
            )}
          </div>
          {totalPages > 1 && (
            <Pagination 
              current={page} 
              onChange={setPage} 
              totalPages={totalPages} 
            />
          )}
        </>
      )}
    </div>
  );
}