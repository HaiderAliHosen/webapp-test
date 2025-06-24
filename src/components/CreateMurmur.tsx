import { useState } from 'react';
// import axios from 'axios';
import api from '../interceptors/api';

export function CreateMurmur({ onCreated }: { onCreated: () => void }) {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsPosting(true);
    try {
      await api.post('/api/murmurs/me', { content });
      setContent('');
      onCreated();
    } catch (error) {
      console.error('Error creating murmur:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white rounded-lg shadow p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        maxLength={280}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">
          {content.length}/280
        </span>
        <button
          type="submit"
          disabled={isPosting || !content.trim()}
          className={`px-4 py-2 rounded ${isPosting || !content.trim() ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {isPosting ? 'Posting...' : 'Murmur'}
        </button>
      </div>
    </form>
  );
}