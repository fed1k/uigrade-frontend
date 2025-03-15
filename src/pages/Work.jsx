import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAnswer, fetchQuestions } from '../services/services';
import CorrectOrWrong from '../components/CorrectOrWrong';

const BASE_API_URL = import.meta.env.VITE_API_URL


function Work() {
  const storedNumber = parseInt(sessionStorage.getItem("currentQuestion")) || 1;
  const [number, setNumber] = useState(storedNumber);
  const [progress, setProgress] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState();
  const [level, setLevel] = useState();
  const [questions, setQuestions] = useState([]);
  const [isCorrect, setIsCorrect] = useState("");
  const [pickedIndex, setPickedIndex] = useState("default");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const navigate = useNavigate();
  const [corrects, setCorrects] = useState(0)

  const handleNext = async (option, index) => {
    const result = await checkAnswer(JSON.stringify({ question_id: currentQuestion.id, answer: option, result_id: +sessionStorage.getItem("result_id") }));
    if (result.correct) {
      setIsCorrect("correct");
      setCorrects(corrects + 1)
    } else {
      setIsCorrect(result.correct_one);
      setCorrectAnswer(result.correct_one);
    }
    setPickedIndex(index);
  };

  const showCorrectAnswer = () => {
    setIsCorrect("correct");
    if (correctAnswer === currentQuestion?.image1) {
      setPickedIndex(0);
    } else if (correctAnswer === currentQuestion?.image2) {
      setPickedIndex(1);
    }
  };


  const handleNextQuestion = () => {
    if (number < questions.length) {
      const nextNumber = number + 1;
      setNumber(nextNumber);
      sessionStorage.setItem("currentQuestion", nextNumber);
      setCurrentQuestion(questions[nextNumber - 1]);
      setPickedIndex("default");
      setIsCorrect("");
      setCorrectAnswer("");
    } else {
      
      navigate("/middle");
      sessionStorage.removeItem("currentQuestion")
    }
  };

  useEffect(() => {
    fetchQuestions().then((qsn) => {
      setQuestions(qsn);
      setCurrentQuestion(qsn[number - 1]);
      setLevel(qsn[number - 1].level);
    });
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setProgress((number / questions.length) * 100);
      setLevel(currentQuestion.level)
    }
  }, [number, questions]);

  // Track incomplete quiz
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (questions.length !== number) {

        const payload = JSON.stringify({ result_id: sessionStorage.getItem("result_id") });
        navigator.sendBeacon(BASE_API_URL + '/mark-incomplete', payload);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, []);

  return (
    <div className='max-w-[794px] mx-auto bg-white my-5 p-5 py-5 rounded-[24px] flex items-center gap-3 justify-center flex-col'>
      <div className="relative flex items-center h-12 md:mb-8 rounded-[16px] w-full bg-[#C8C8C833]">
        <div
          className="h-12 bg-[#01A3FE] transition-all flex items-center justify-center rounded-[16px]"
          style={{ width: `${progress}%` }}
        >
          <span className="absolute left-[20%] md:left-[40%] text-Inter text-center leading-5 text-[20px] text-[#222222] font-medium">
            {level} уровень {number} / {questions.length}
          </span>
        </div>
      </div>

      <p className='text-Inter font-medium text-[16px] md:text-[20px] mb-5 text-center leading-5 text-[#C8C8C8]'>
        Выбери правильный вариант
      </p>

      {pickedIndex === 0 || pickedIndex === "default" ? (
        <div className='w-full pt-6 cursor-pointer hover:scale-[1.02] transition-all mb-2 rounded-[24px]'>
          <CorrectOrWrong answer={isCorrect} />
          <img
            onClick={() => handleNext(currentQuestion?.image1, 0)}
            src={"https://s3.regru.cloud/uigrade/" + currentQuestion?.image1}
            className='w-full cursor-pointer h-full object-cover rounded-[24px]'
            alt=""
          />
        </div>
      ) : null}

      {pickedIndex === 1 || pickedIndex === "default" ? (
        <div className='w-full pt-6 cursor-pointer rounded-[24px]'>
          <CorrectOrWrong answer={isCorrect} />
          <img
            onClick={() => handleNext(currentQuestion?.image2, 1)}
            src={"https://s3.regru.cloud/uigrade/" + currentQuestion?.image2}
            className='w-full hover:scale-[1.02] transition-all cursor-pointer h-full object-cover rounded-[24px]'
            alt=""
          />
        </div>
      ) : null}

      {isCorrect ? (
        <div className='flex gap-2 w-[70%]'>
          {isCorrect !== "correct" ? (
            <button onClick={showCorrectAnswer} className='bg-[#F4F4F4] p-2.5 flex-1 rounded-[16px]'>
              Правилний
            </button>
          ) : null}
          {(questions.length === number) && <button onClick={handleNextQuestion} className='p-2.5 rounded-[16px] flex-1 min-h-[56px] text-center bg-[#222222] text-white'>
            разрешить
          </button>}
          {!(questions.length === number) && <button onClick={handleNextQuestion} className='p-2.5 rounded-[16px] flex-1 min-h-[56px] text-center bg-[#222222] text-white'>
            Следюший
          </button>}
        </div>
      ) : null}
    </div>
  );
}

export default Work;
