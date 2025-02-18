import React from 'react'
import { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";


const questions = [
 "https://images.unsplash.com/photo-1739632141610-018cfc9e60ef?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
]

function Answer() {
  const [answer, setAnswer] = useState(false)
  const [number, setNumber] = useState(33);
  return (
    <div className='max-w-[794px] mx-auto bg-white my-5 p-5  rounded-[24px] flex items-center gap-3 justify-center flex-col'>
      <div className="relative flex items-center h-12  md:mb-8 rounded-[16px] w-full bg-[#C8C8C833] ">
        <div className="h-12 bg-[#01A3FE]  w-full flex items-center justify-center rounded-[16px] " style={{ width: `${number}%` }}>
          <span className="absolute left-[20%] md:left-[40%] text-Inter text-center leading-5 text-[20px] text-[#222222] font-medium">Легкий уровень 1 / 3</span>
        </div>

      </div>
      {answer &&
        <div className='flex gap-1 items-center mb-4'>
          <span className='p-[3px] bg-green-300 rounded-full'><FaCheck className='text-green-500 w-3 h-3' /></span>
          <p className='text-Inter text-[20px] leading-5 text-center font-medium text-[#16A34A]'>Правильно</p>
        </div>
      }

      {!answer &&
        <div className='flex gap-1 items-center mb-4'>
          <span className='p-[2px] bg-red-300 rounded-full'><RxCross2 className='text-red-500 w-4 h-4' /></span>
          <p className='text-Inter text-[20px] leading-5 text-center font-medium text-[#DC2626]'>Неправильно</p>
        </div>
      }
      <div className='w-full h-[189px] md:h-[371px] bg-[#D9D9D9] mb-5 rounded-[24px]'></div>

      {answer &&
        <p className='text-Inter text-[20px] leading-5 text-center font-medium mb-[101px] md:mb-[251px] text-[#C8C8C8]'>Иконки в этом варианте правильные</p>
      }
      {!answer &&
        <p className='text-Inter text-[20px] leading-5 text-center font-medium mb-[101px] md:mb-[251px] text-[#C8C8C8]'>Иконки в этом варианте неправильные</p>
      }

      <div className='flex items-center gap-2'>
        {!answer && <button className=' min-w-[143px] md:min-w-[189px] bg-[#F4F4F4] text-Inter font-medium text-[16px] leading-5 text-center p-2.5 rounded-[16px] text-[#222222]'>Правильный</button>}
        {!answer && <button className={`min-w-[143px] md:min-w-[189px] bg-[#222222] text-Inter font-medium text-[16px] leading-5 text-center p-2.5 rounded-[16px] text-[#FFFFFF]`}>Следующий</button>}
        {answer && <button className={`min-w-[286px] md:min-w-[388px] bg-[#222222] text-Inter font-medium text-[16px] leading-5 text-center p-2.5 rounded-[16px] text-[#FFFFFF]`}>Следующий</button>}
      </div>
    </div>
  )
}

export default Answer
