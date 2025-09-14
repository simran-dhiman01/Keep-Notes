import { Navigate, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Health from './components/Health'
import { AuthContext } from './context/authContext';
import { useContext } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // if no user → redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <div className='fixed inset-0 bg-gray-300 flex items-center justify-center'>
            <Login />
          </div>
        } />
        <Route path='/health' element={<Health />} />
      </Routes>
    </>

  )
}

export default App