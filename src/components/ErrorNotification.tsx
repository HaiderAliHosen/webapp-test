import { useEffect } from 'react';
import { useError } from '../context/ErrorContext';

export function ErrorNotification() {
  const { error, setError } = useError();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
      {error}
      <button 
        onClick={() => setError(null)}
        className="ml-4 font-bold"
      >
        ×
      </button>
    </div>
  );
}