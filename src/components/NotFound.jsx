import React from 'react'
import { Link } from 'react-router'

const NotFound = () => {
  return (
    <div className='h-screen w-full flex flex-col justify-center items-center bg-black'>
      <h1 className='text-red-500 text-9xl font-extrabold'>404</h1>
      <h2 className='text-white text-4xl font-bold my-8'>Page Not Found!</h2>
      <Link
        to="/"
        className='text-white text-2xl font-bold bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 transition'
      >
        Return Home
      </Link>
    </div>
  )
}

export default NotFound