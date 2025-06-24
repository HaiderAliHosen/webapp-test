import { useState, useEffect, useCallback } from 'react';
import api from '../interceptors/api';
import { getAuthToken } from '../utils/auth';
import { MurmurCard } from '../components/MurmurCard';
import { Pagination } from '../components/Pagination';
import { CreateMurmur } from '../components/CreateMurmur';
import { Murmur } from '../types';
import { useNavigate } from 'react-router-dom';

export function Timeline() {
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMurmurs = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await api.get(`/api/murmurs?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        }
      });

      const responseData = response.data;
      const murmursData = Array.isArray(responseData)
        ? responseData
        : responseData.items || [];

      const processedMurmurs = murmursData.map(murmur => ({
        ...murmur,
        isLiked: murmur.isLiked || false,
        likeCount: murmur.likeCount || murmur.likes?.length || 0,
      }));

      setMurmurs(processedMurmurs);
      setTotalPages(responseData.totalPages || 1);
    } catch (error) {
      console.error('Error fetching murmurs:', error);
      setMurmurs([]);
    } finally {
      setIsRefreshing(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMurmurs();
  }, [fetchMurmurs]);

  const handleLike = async (murmurId: number) => {
    try {
      setMurmurs(prev =>
        prev.map(murmur =>
          murmur.id === murmurId
            ? {
                ...murmur,
                isLiked: !murmur.isLiked,
                likeCount: murmur.isLiked
                  ? murmur.likeCount - 1
                  : murmur.likeCount + 1,
              }
            : murmur
        )
      );

      const response = await api.post(`/api/murmurs/${murmurId}/like`);

      if (response.data) {
        setMurmurs(prev =>
          prev.map(m => (m.id === murmurId ? response.data : m))
        );
      }
    } catch (error) {
      console.error('Error handling like:', error);
      setMurmurs(prev => [...prev]); // revert fallback
    }
  };

  const handleCreated = async () => {
    setPage(1);
    await fetchMurmurs();
  };

  const navigate = useNavigate(); // <-- initialize navigate

  const handleUsernameClick = (userId: number | string) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <CreateMurmur onCreated={handleCreated} />

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
                  onUsernameClick={handleUsernameClick}
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
