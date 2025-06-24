import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-500">Murmur</Link>
        
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-500">Home</Link>
            {user && (
              <Link to={`/users/${user.id}`} className="flex items-center space-x-2">
                <img 
                  src={user.avatar_url || '/default-avatar.png'} 
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.name}</span>
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              Login
            </Link>
            <Link to="/register" className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}