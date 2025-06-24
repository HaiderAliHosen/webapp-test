import { useEffect, useState } from 'react';
// import axios from 'axios';
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
      setIsCurrentUser(false); // Implement your auth check here
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
            <p className="font-semibold">0</p> {/* Replace with actual follower count */}
            <p className="text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">0</p> {/* Replace with actual following count */}
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
          <MurmurCard 
            key={murmur.id} 
            murmur={murmur} 
            onLike={async () => {
              await api.post(`/api/murmurs/${murmur.id}/like`);
              // Refresh data
              const res = await api.get(`/api/murmurs/user/${userId}`);
              setMurmurs(res.data);
            }} 
          />
        ))}
      </div>
    </div>
  );
}