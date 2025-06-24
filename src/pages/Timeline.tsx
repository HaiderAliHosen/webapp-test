import { useState, useEffect } from 'react';
import api from '../interceptors/api';
import { getCurrentUserId, getAuthToken } from '../utils/auth';
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
        const currentUserId = getCurrentUserId();
        console.log(currentUserId, getAuthToken());
        const response = await api.get(`/api/murmurs?page=${page}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          }
        });
        
        const responseData = response.data;
        const murmursData = Array.isArray(responseData) ? responseData : responseData.items || [];
        
        // Ensure each murmur has proper like data
        const processedMurmurs = murmursData.map(murmur => ({
          ...murmur,
          isLiked: murmur.isLiked || false, // Fallback to false if undefined
          likeCount: murmur.likeCount || murmur.likes?.length || 0 // Multiple fallbacks
        }));

        setMurmurs(processedMurmurs);
        setTotalPages(responseData.totalPages || 1);
      } catch (error) {
        console.error('Error fetching murmurs:', error);
        setMurmurs([]);
      } finally {
        setIsRefreshing(false);
      }
    }
    fetchMurmurs();
  }, [page]);

  const handleLike = async (murmurId: number) => {
    try {
      // Optimistic update
      setMurmurs(prev => prev.map(murmur => {
        if (murmur.id === murmurId) {
          return {
            ...murmur,
            isLiked: !murmur.isLiked,
            likeCount: murmur.isLiked ? murmur.likeCount - 1 : murmur.likeCount + 1
          };
        }
        return murmur;
      }));

      // Call API
      const response = await api.post(`/api/murmurs/${murmurId}/like`);
      
      // Update with server response if needed
      if (response.data) {
        setMurmurs(prev => prev.map(m => 
          m.id === murmurId ? response.data : m
        ));
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