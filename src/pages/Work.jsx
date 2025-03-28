"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { checkAnswer, fetchQuestions } from "../services/services"
import CorrectOrWrong from "../components/CorrectOrWrong"
import {randomizeImageOrders} from "../utils/util"

const BASE_API_URL = import.meta.env.VITE_API_URL

function Work() {
  const storedNumber = Number.parseInt(sessionStorage.getItem("currentQuestion")) || 1
  const [number, setNumber] = useState(storedNumber)
  const [progress, setProgress] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState()
  const [level, setLevel] = useState()
  const [questions, setQuestions] = useState([])
  const [isCorrect, setIsCorrect] = useState("")
  const [pickedIndex, setPickedIndex] = useState("default")
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [corrects, setCorrects] = useState(0)
  const navigate = useNavigate()

  const handleNext = async (option, index) => {
    let result
    if (!isCorrect) {
      result = await checkAnswer(
        JSON.stringify({
          question_id: currentQuestion.id,
          answer: option,
          result_id: +sessionStorage.getItem("result_id"),
        }),
      )
    }
    if (result.correct) {
      setIsCorrect("correct")
      setCorrects(corrects + 1)
    } else {
      setIsCorrect(result.correct_one)
      setCorrectAnswer(result.correct_one)
    }
    setPickedIndex(index)
  }

  const showCorrectAnswer = () => {
    setIsCorrect("correct")
    if (correctAnswer === currentQuestion?.image1) {
      setPickedIndex(0)
    } else if (correctAnswer === currentQuestion?.image2) {
      setPickedIndex(1)
    }
  }

  const handleNextQuestion = () => {
    if (number < questions.length) {
      const nextNumber = number + 1
      setNumber(nextNumber)
      sessionStorage.setItem("currentQuestion", nextNumber)
      setCurrentQuestion(questions[nextNumber - 1])
      setPickedIndex("default")
      setIsCorrect("")
      setCorrectAnswer("")
    } else {
      navigate("/middle")
      sessionStorage.removeItem("currentQuestion")
    }
  }

  useEffect(() => {
    fetchQuestions().then((qsn) => {
      randomizeImageOrders(qsn)
      setQuestions(qsn)
      setCurrentQuestion(qsn[number - 1])
      setLevel(qsn[number - 1].level)
    })
  }, [])

  useEffect(() => {
    if (questions.length > 0) {
      setProgress((number / questions.length) * 100)
      setLevel(currentQuestion.level)
    }
  }, [number, questions])

  // Track incomplete quiz
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (questions.length !== number) {
        const payload = JSON.stringify({ result_id: sessionStorage.getItem("result_id") })
        navigator.sendBeacon(BASE_API_URL + "/mark-incomplete", payload)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  return (
    <div className={`max-w-[794px] mx-auto bg-white mt-1 sm:mt-3 p-2 sm:p-4 rounded-[24px] flex flex-col ${navigator.userAgent.match(/iPhone/i) ? "h-[calc(100vh-14rem)]" : "h-[calc(100vh-8rem)]"}  sm: max-h-[800px] overflow-hidden`}>
      {/* Progress bar - smaller height */}
      <div className="relative flex items-center h-10 rounded-[16px] w-full bg-[#C8C8C833] mb-1 sm:mb-2">
        <div
          className="h-full bg-[#01A3FE] transition-all flex items-center justify-center rounded-[16px]"
          style={{ width: `${progress}%` }}
        >
          <span className="absolute text-Inter inset-x-0 text-center text-[#222222] font-medium">
            {level} уровень {number} / {questions.length}
          </span>
        </div>
      </div>

      {/* Question text - smaller and more compact */}
      {pickedIndex === "default" ? (
        <p className="text-Inter font-medium text-xs sm:text-sm text-center text-[#C8C8C8] mb-1">
          {currentQuestion?.question_text}
        </p>
      ) : (
        <></>
      )}

      {/* Images container - strict height control */}
      <div className="flex gap-4 justify-center items-center flex-col flex-1 sm:flex-row min-h-0 ">
        {pickedIndex === 0 || pickedIndex === "default" ? (
          <div className={`w-full flex flex-col`}>
            <CorrectOrWrong answer={isCorrect} />
            <div className={`flex-1 min-h-0 ${pickedIndex !== "default" ? 'flex justify-center' : ''} overflow-hidden rounded-[24px]`}>
              <img
                onClick={() => handleNext(currentQuestion?.image1, 0)}
                src={"https://s3.regru.cloud/uigrade/" + currentQuestion?.image1}
                className={`w-[300px] h-[160px] mx-auto ${pickedIndex !== "default" ? 'sm:w-[500px] sm:h-[200px]' : ''} sm:mx-0 object-contain rounded-[24px] hover:scale-[1.01] transition-all cursor-pointer`}
                alt=""
              />
            </div>
            {pickedIndex !== "default" && (
              <p className="text-center text-[#C8C8C8] pt-4 text-xs sm:text-sm font-medium truncate">
                {currentQuestion?.desc}
              </p>
            )}
          </div>
        ) : null}

        {pickedIndex === 1 || pickedIndex === "default" ? (
          <div className={`w-full flex flex-col `}>
            <CorrectOrWrong answer={isCorrect} />
            <div className={`flex-1 min-h-0 ${pickedIndex !== "default" ? 'flex justify-center' : ''} overflow-hidden rounded-[24px]`}>
              <img
                onClick={() => handleNext(currentQuestion?.image2, 1)}
                src={"https://s3.regru.cloud/uigrade/" + currentQuestion?.image2}
                className={`w-[300px] h-[160px] mx-auto sm:mx-0 ${pickedIndex !== "default" ? 'sm:w-[500px] sm:h-[200px]' : ''} object-contain rounded-[24px] hover:scale-[1.01] transition-all cursor-pointer`}
                alt=""
              />
            </div>
            {pickedIndex !== "default" && (
              <p className="text-center text-[#C8C8C8] pt-4 text-xs sm:text-sm font-medium truncate">
                {currentQuestion?.desc}
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Buttons - more compact */}
      {isCorrect ? (
        <div className="flex gap-2 w-full sm:w-[90%] mx-auto mt-1 sm:mt-2 mb-1">
          {isCorrect !== "correct" ? (
            <button
              onClick={showCorrectAnswer}
              className="bg-[#F4F4F4] p-1.5 sm:p-2 flex-1 rounded-[16px] text-xs sm:text-sm"
            >
              Правилний
            </button>
          ) : null}
          <button
            onClick={handleNextQuestion}
            className="p-1.5 sm:p-2 rounded-[16px] flex-1 min-h-[36px] sm:min-h-[40px] text-center bg-[#222222] text-white text-xs sm:text-sm"
          >
            {questions.length === number ? "разрешить" : "Следюший"}
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default Work

