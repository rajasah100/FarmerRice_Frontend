import React from 'react'
import Navbar from '@/features/public/components/common/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '@/features/public/components/common/Footer'


const UserLayout = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
        <Outlet />

      {/* Footer */}
      <Footer />
    </>
  )
}

export default UserLayout
