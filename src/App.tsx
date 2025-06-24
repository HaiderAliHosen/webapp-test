import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorProvider } from './context/ErrorContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ErrorNotification } from './components/ErrorNotification';
import { Timeline } from './pages/Timeline';
import { UserProfile } from './pages/UserProfile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Navigation } from './components/Navigation';
import { PrivateRoute } from './components/PrivateRoute';

export function App() {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <main className="container mx-auto py-4">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  {/* Protected routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Timeline />} />
                    <Route path="/users/:userId" element={<UserProfile />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <ErrorNotification />
            </div>
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </ErrorProvider>
  );
}
// import { useState, useEffect } from 'react'
// import axios from 'axios'

// function App() {
//   const [data, setData] = useState<any>(null)
  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.post('/api/postTest')
//         console.log(res.data)
//         setData(res.data)
//       } catch (error) {
//         console.error('Error fetching data:', error)
//       }
//     }
    
//     fetchData()
//   }, [])

//   return (
//     <div>
//       <h1>Display the data obtained from API here</h1>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   )
// }

export default App