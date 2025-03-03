import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
function Mainlayout() {

  const route = useLocation()

  return (
    <div className='px-5 min-h-screen py-5 pb-12 bg-[#F4F4F4]'>
      {route.pathname !== "/admin" ? <header>
        <Navbar/>
      </header> : <></>}
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default Mainlayout
