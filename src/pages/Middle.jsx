import React, { useEffect, useState } from 'react'
import { FaTelegramPlane } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { getResult, incrementTgVisitCount } from '../services/services';
function Middle() {

  const [result, setResult] = useState()

  const handleTgRedirect = async() => {
    const response = await incrementTgVisitCount();

    console.log(response)
  }

  useEffect(() => {
    const result_id = sessionStorage.getItem("result_id");
    getResult(result_id).then((res) => {
      if(res.status === 200) {
        setResult(res.data)
      }
    })
  }, [])

  return (
    <div className='max-w-[794px]  mx-auto bg-white my-5 p-5 rounded-[24px] flex items-center gap-3 pt-[120px] md:pt-[272px] flex-col px-5 md:px-[102px] pb-[20px] md:pb-[306px] justify-center'>
      <div className='max-w-[590px] px-24'>
        <p className='text-Inter font-bold leading-[64px] text-[48px] lg:text-[64px] mb-5 md:mb-6 text-center text-[#222222]'>Твой уровень <br />
          {result?.grade}</p>

        <p className='text-Inter font-medium text-[20px] text-center mb-[106px] md:mb-10 leading-5 text-[#C8C8C8]'>Ты ответил правильно на {result?.correct_count} вопросов и <br /> набрал {result?.score} баллов</p>

        <a href="https://t.me/+TOQEscPuVNhiNWZi" target='_blank' onClick={handleTgRedirect} className='flex gap-2 justify-center items-center mb-6 bg-[#01A3FE] p-2.5 rounded-[16px] h-14 w-[295px] md:w-[385px]'>
          <span className='text-Inter text-white text-[20px] font-medium'>Наш телеграм-канал</span>
          <FaTelegramPlane className='w-5 h-5 text-white' />
        </a>
        <Link to="/">
          <p className='text-Inter cursor-pointer font-medium text-[20px] text-center mb-5 leading-5 text-[#01A3FE]'>Пройти тест заново</p>
        </Link>
      </div>
    </div>
  )
}

export default Middle
