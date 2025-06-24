import { useEffect, useState } from 'react';
import { getCurrentUserId } from '../utils/auth';
import api from '../interceptors/api';
import { useParams } from 'react-router-dom';
import { User, Murmur } from '../types';
import { MurmurCard } from '../components/MurmurCard';

export function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [userRes, murmursRes] = await Promise.all([
        api.get(`/api/users/${userId}`),
        api.get(`/api/murmurs/user/${userId}`),
      ]);
      setUser(userRes.data);
      setMurmurs(murmursRes.data);
      // Check if current user (you'd get this from your auth context)
      const currentUserId = getCurrentUserId()?.toString();
      setIsCurrentUser(currentUserId === userId);
    }
    fetchData();
  }, [userId]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.delete(`/api/users/${userId}/follow`);
      } else {
        await api.post(`/api/users/${userId}/follow`);
      }
      setIsFollowing(prev => !prev);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleDeleteMurmur = async (murmurId: number) => {
    try {
      await api.delete(`/api/murmurs/me/${murmurId}`);
      // Remove the deleted murmur from state
      setMurmurs(prev => prev.filter(murmur => murmur.id !== murmurId));
    } catch (error) {
      console.error('Error deleting murmur:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <div className="flex items-center space-x-4">
          <img 
            src={user.avatar_url || '/default-avatar.png'} 
            alt={user.username}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-gray-500">@{user.username}</p>
            {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <div className="text-center">
            <p className="font-semibold">{murmurs.length}</p>
            <p className="text-gray-500">Murmurs</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{user?.followersCount}</p>
            <p className="text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{user?.followingCount}</p>
            <p className="text-gray-500">Following</p>
          </div>
        </div>

        {!isCurrentUser && (
          <button
            onClick={handleFollow}
            className={`mt-4 w-full py-2 rounded ${isFollowing ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {murmurs.map(murmur => (
          <div key={murmur.id} className="relative">
            <MurmurCard 
              murmur={murmur} 
              onLike={async () => {
                await api.post(`/api/murmurs/${murmur.id}/like`);
                // Refresh data
                const res = await api.get(`/api/murmurs/user/${userId}`);
                setMurmurs(res.data);
              }} 
            />
            {isCurrentUser && (
              <button
                onClick={() => handleDeleteMurmur(murmur.id)}
                className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-500"
                title="Delete murmur"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}