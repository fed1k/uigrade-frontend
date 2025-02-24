import React, { useEffect, useState } from 'react'
import { updateProgress } from '../utils/util';
import { useNavigate } from 'react-router-dom';
import { checkAnswer, fetchQuestions } from '../services/services';
import CorrectOrWrong from '../components/CorrectOrWrong';

// const questions = [
//   {
//     level: "Easy",
//     url: "https://images.unsplash.com/photo-1739632141610-018cfc9e60ef?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//   },
//   {
//     level: "Medium",
//     url: "https://images.unsplash.com/photo-1739532049391-2867bd1a71e8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//   },
//   {
//     level: "Hard",
//     url: "https://images.unsplash.com/photo-1739538475083-43bbf5c47646?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//   }
// ]

function Work() {
  const [number, setNumber] = useState(1);
  const [progress, setProgress] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState()
  const [level, setLevel] = useState()
  const [questions, setQuestions] = useState([])
  const [isCorrect, setIsCorrect] = useState("")
  const [pickedIndex, setPickedIndex] = useState("default")

  const navigate = useNavigate()

  const handleNext = async (option, index) => {
    const result = await checkAnswer(JSON.stringify({ question_id: currentQuestion.id, answer: option }))
    console.log(result)
    setIsCorrect(result.correct ? "correct" : result.correct_one)
    setPickedIndex(index)
    // if (number === questions.length) {
    //   navigate("/middle")
    // } {
    //   setNumber((prev) => (prev + 1))
    // }
  }

  useEffect(() => {
    fetchQuestions().then((qsn) => {
      setQuestions(qsn)
      setCurrentQuestion(qsn[number - 1])
      setLevel(qsn[number - 1].level)
    })
  }, [])


  // useEffect(() => {
  //   setProgress(updateProgress(number, questions.length))
  //   setCurrentQuestion(questions[number - 1])
  //   setLevel(currentQuestion.level)
  // }, [handleNext])
  // https://s3.regru.cloud/uigrade/

  console.log(pickedIndex)

  return (
    <div className='max-w-[794px]   mx-auto bg-white my-5 p-5 py-5 rounded-[24px] flex items-center gap-3 justify-center flex-col'>
      <div className="relative flex items-center h-12  md:mb-8 rounded-[16px] w-full bg-[#C8C8C833] ">
        <div className="h-12 bg-[#01A3FE] w-full transition-all flex items-center justify-center rounded-[16px] " style={{ width: `${progress}%` }}>
          <span className="absolute left-[20%] md:left-[40%] text-Inter text-center leading-5 text-[20px] text-[#222222] font-medium">{level} уровень {number} / {questions?.length}</span>
        </div>

      </div>
      <p className='text-Inter font-medium text-[16px] md:text-[20px] mb-5 text-center leading-5 text-[#C8C8C8]'>Выбери правильный вариант</p>
      {pickedIndex === 0 || pickedIndex === "default" ? <div className='w-full pt-6 cursor-pointer hover:scale-[1.02] transition-all   mb-2 rounded-[24px]'>
        <CorrectOrWrong answer={isCorrect} />
        <img onClick={() => handleNext(currentQuestion?.image1, 0)} src={"https://s3.regru.cloud/uigrade/" + currentQuestion?.image1} className='w-full cursor-pointer h-full object-cover rounded-[24px]' alt="" />
      </div> : <></>}

      {pickedIndex === 1 || pickedIndex === "default" ? <div className='w-full pt-6 cursor-pointer rounded-[24px]'>
        <CorrectOrWrong answer={isCorrect} />
        <img onClick={() => handleNext(currentQuestion?.image2, 1)} src={"https://s3.regru.cloud/uigrade/" + currentQuestion?.image2} className='w-full hover:scale-[1.02] transition-all cursor-pointer h-full object-cover rounded-[24px]' alt="" />
      </div> : <></>}

      {isCorrect ? <div className='flex gap-2 w-[70%]'>
        {isCorrect !== "correct" ? <button className='bg-[#F4F4F4] p-2.5  flex-1 rounded-[16px]'>Правилний</button> : <></>}
        <button className='p-2.5 rounded-[16px] flex-1 min-h-[56px] text-center bg-[#222222] text-white'>Следюший</button>
      </div> : <></>}
    </div>
  )
}

export default Work
