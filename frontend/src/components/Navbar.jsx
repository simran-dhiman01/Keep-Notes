import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoChevronDown } from "react-icons/go";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from '../context/authContext';


const Navbar = () => {
   const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev)
  }
  const handleLogout = async () => {
    await logout();
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  
  return (
    <header className='bg-white/90 sticky top-0 z-50 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans'>
      <div className='flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto'>
        {/* Logo */}
        <div className='flex items-center gap-2 cursor-pointer'
          onClick={() => navigate('/')}>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text'>KeepNotes</h1>
        </div>
        {/* Right side user profile */}
        <div ref={menuRef} className='relative '>
          <button
            onClick={handleMenuToggle}
            className='flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-purple-50 transition-colors duration-300 border border-transparent hover:border-purple-200'>
            {/* profile image */}
            <div className='relative'>
                  <div className='w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold shadow-sm text-white'>
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
              <div className='bg-green-600 rounded-full animate-pulse border-2 border-white w-3 h-3 -bottom-0.5 -right-0.5 absolute'></div>
            </div>
            {/* username and email */}
            <div className='text-left md:flex flex-col hidden'>
              <span className='text-sm font-medium'>{user?.email}</span>
              <span className='text-xs text-gray-600'>{user?.role}</span>
            </div>
            <GoChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300  ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <ul className='absolute top-full mt-2 sm:left-0 md:left-1/2 xl:right-full -translate-x-2/3  sm:right-0 rounded-2xl bg-white w-48 sm:w-56 animate-fadeIn z-50 shadow-lg border border-purple-100'>
              <li className='px-2 py-1'>
                <button
                  onClick={handleLogout}
                  className='flex items-center cursor-pointer gap-2 w-full px-4 py-2.5 text-left hover:bg-purple-50 text-base text-red-600 transition-colors group'
                  role='menuitem'>
                  <FiLogOut className='w-5 h-5 text-red-600 font-bold' />
                  Log out
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
