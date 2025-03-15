import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { initResult } from '../services/services'
function Home() {

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleStart = async() => {
    setLoading(true)
    const result = await initResult()
    if (result.status === 200) {
      sessionStorage.setItem("result_id", result.id)
      setLoading(false)
      navigate("/work")
    }
  }

  return (
    <div className='max-w-[794px]  mx-auto bg-white my-5 py-5 rounded-[24px] flex items-center gap-3 pt-[140px] md:pt-[240px] flex-col px-5 md:px-[102px] pb-[20px] md:pb-[318px] justify-center'>
      <div className='max-w-[590px]'>
        <p className='text-Inter font-bold leading-[48px] md:leading-[64px] text-[48px] lg:text-[64px] mb-5 md:mb-6 text-center text-[#222222]'>Узнай свой <br />  уровень <br /> в  UI дизайне</p>
        <p className='text-Inter font-medium text-[20px] text-center mb-[106px] md:mb-10 leading-5 text-[#C8C8C8]'>Пройди тест из 3 уровней сложности <br /> и  получи грейд с оценкой</p>
        <div className='flex flex-col'>

          <button disabled={loading} onClick={handleStart} className='p-2.5 disabled:cursor-not-allowed disabled:opacity-50 rounded-[16px] min-h-[56px] text-center bg-[#222222] text-white'>Начать</button>
          <button disabled={loading} onClick={() => navigate("/login")} className='p-2.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2 rounded-[16px] min-h-[56px]   text-center bg-[#222222] text-white'>Админ</button>
        </div>
      </div>
    </div>
  )
}

export default Home
