import React from 'react'
import { FaTelegramPlane } from "react-icons/fa";
function Middle() {
  return (
    <div className='max-w-[794px]  mx-auto bg-white my-5 p-5 rounded-[24px] flex items-center gap-3 pt-[120px] md:pt-[272px] flex-col px-5 md:px-[102px] pb-[20px] md:pb-[306px] justify-center'>
         <div className='max-w-[590px] px-24'>
          <p className='text-Inter font-bold leading-[64px] text-[48px] lg:text-[64px] mb-5 md:mb-6 text-center text-[#222222]'>Твой уровень <br />
         Middle</p>

          <p className='text-Inter font-medium text-[20px] text-center mb-[106px] md:mb-10 leading-5 text-[#C8C8C8]'>Ты ответил правильно на 9 вопросов и <br  /> набрал 49 баллов</p>

          <button className='flex gap-2 justify-center items-center mb-6 bg-[#01A3FE] p-2.5 rounded-[16px] h-14 w-[295px] md:w-[385px]'>
             <span className='text-Inter text-white text-[20px] font-medium'>Наш телеграм-канал</span>
            <FaTelegramPlane className='w-5 h-5 text-white'/>
          </button>

          <p  className='text-Inter font-medium text-[20px] text-center mb-5 leading-5 text-[#01A3FE]'>Пройти тест заново</p>
         </div>
    </div>
  )
}

export default Middle
