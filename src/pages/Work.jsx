import React, { useEffect, useState } from 'react'
import { updateProgress } from '../utils/util';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    level: "Easy",
    url: "https://images.unsplash.com/photo-1739632141610-018cfc9e60ef?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    level: "Medium",
    url: "https://images.unsplash.com/photo-1739532049391-2867bd1a71e8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    level: "Hard",
    url: "https://images.unsplash.com/photo-1739538475083-43bbf5c47646?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
]

function Work() {
  const [number, setNumber] = useState(1);
  const [progress, setProgress] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(questions[number - 1])
  const [level, setLevel] = useState(currentQuestion.level)

  const navigate = useNavigate()

  const handleNext = () => {
    if (number === questions.length) {
      navigate("/middle") 
    } {

      // console.log(number)
      setNumber((prev) => (prev + 1))
    }
  }


  useEffect(() => {
    setProgress(updateProgress(number, questions.length))
    setCurrentQuestion(questions[number - 1])
    setLevel(currentQuestion.level)
  }, [handleNext])

  return (
    <div className='max-w-[794px]   mx-auto bg-white my-5 p-5 py-5 rounded-[24px] flex items-center gap-3 justify-center flex-col'>
      <div className="relative flex items-center h-12  md:mb-8 rounded-[16px] w-full bg-[#C8C8C833] ">
        <div className="h-12 bg-[#01A3FE] w-full transition-all flex items-center justify-center rounded-[16px] " style={{ width: `${progress}%` }}>
          <span className="absolute left-[20%] md:left-[40%] text-Inter text-center leading-5 text-[20px] text-[#222222] font-medium">{level} уровень {number} / 3</span>
        </div>

      </div>
      <p className='text-Inter font-medium text-[16px] md:text-[20px] mb-5 text-center leading-5 text-[#C8C8C8]'>Выбери правильный вариант</p>
      <div className='w-full cursor-pointer hover:scale-[1.02] transition-all h-[189px] md:h-[371px] bg-[#D9D9D9] mb-2 rounded-[24px]'>
        <img onClick={handleNext} src={currentQuestion.url} className='w-full cursor-pointer h-full object-cover rounded-[24px]' alt="" />
      </div>
      <div className='w-full h-[189px] cursor-pointer md:h-[371px] bg-[#D9D9D9] rounded-[24px]'>
        <img onClick={handleNext} src={currentQuestion.url} className='w-full hover:scale-[1.02] transition-all cursor-pointer h-full object-cover rounded-[24px]' alt="" />
      </div>
    </div>
  )
}

export default Work
