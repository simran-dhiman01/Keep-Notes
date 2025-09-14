import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Health from './components/Health'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={
          <div className='fixed inset-0 bg-gray-300 flex items-center justify-center'>
            <Login />
          </div>
        } />
        <Route path='/health' element={<Health />}/>
      </Routes>
    </>

  )
}

export default App