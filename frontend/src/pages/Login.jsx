import React, { useContext, useState } from 'react'
import { LuLogIn } from "react-icons/lu";
import { AuthContext } from '../context/authContext'
import { Lock, Mail, } from 'lucide-react'
import { TbEyeOff, TbEye } from "react-icons/tb";


const INITIAL_FORM = { name: "", email: "", password: "" }
const Login = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const { login, loading, error } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const FIELDS = [
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true
    },
  ]
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(formData.email, formData.password);
    if (user) {
      setFormData(INITIAL_FORM); // reset form 
    }
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className='max-w-lg w-full bg-white shadow-lg border border-purple-100 rounded-xl mx-2 p-8'>
      <div className='flex items-center flex-col justify-center gap-3'>
        <div className='w-16 h-16 rounded-full text-3xl text-white font-bold flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500'>
          <LuLogIn />
        </div>
        <div className='flex flex-col items-center justify-center gap-0.5'>
          <h3 className='text-xl sm:text-3xl font-bold text-gray-800'>Welcome Back</h3>
          <p className='text-base sm:text-lg text-gray-500 text-center font-medium'>
            Login to your Account
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4 mt-8'>
        {FIELDS.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
        
            <div key={name}
              className='flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-300'>
              <Icon className='w-5 h-5 mr-2 text-purple-500' />
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                required

                className='w-full outline-none text-gray-700' />
              {isPassword && (
                <button type='button' onClick={() => setShowPassword((prev) => !prev)}
                  className='ml-2 text-gray-500 transition-colors'>
                  {showPassword ? <TbEyeOff className='text-2xl' /> : <TbEye className='text-2xl' />}
                </button>
              )}
            </div>
       
        ))}
        {error && (
          <div className="text-red-500 p-2 bg-red-50 w-full text-base mt-1 text-center">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 cursor-pointer text-white font-medium text-lg py-2.5 rounded-lg transition">
          {loading ? "Please wait..." : "Login"}
        </button>
      </form >
    </div >
  )
}

export default Login
