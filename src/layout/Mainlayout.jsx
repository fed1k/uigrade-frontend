import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
function Mainlayout() {
  return (
    <div className='px-5 py-5 pb-12 bg-[#F4F4F4]'>
      <header>
        <Navbar/>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default Mainlayout
