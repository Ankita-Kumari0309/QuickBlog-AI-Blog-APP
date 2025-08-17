import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' 

const Signup = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const API_URL = "https://quickblog-backend-3w61.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      //  Send data to backend
      const res = await axios.post(`${API_URL}/api/authRoutes/signup`, {
        username: fullName, 
        email,
        password
      })

      console.log(res.data) // backend response
      alert("Signup successful!")

      // Redirect to login after signup
      navigate("/login")
    } catch (err) {
      console.error(err.response?.data || err.message)
      alert(err.response?.data?.message || "Signup failed")
    }
  }

  return (
    <div className='max-w-md mx-auto mt-20 p-6 border rounded shadow'>
      <h2 className='text-2xl font-bold mb-6'>Sign Up</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Full Name'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className='border p-2 rounded'
        />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='border p-2 rounded'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='border p-2 rounded'
        />
        <button type='submit' className='bg-primary text-white py-2 rounded'>
          Sign Up
        </button>
      </form>

      <div className='mt-4 text-center'>
        <p className='mb-2'>Already have an account?</p>
        <button
          onClick={() => navigate('/login')}
          className='text-primary font-semibold underline'
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default Signup
