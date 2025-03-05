import { useEffect, useRef, useState } from "react"
import { addGrade, addHardness, deleteGrade, deleteHardness, deleteQuestion, fetchQuestions, getGrades } from "../services/services"
import { ToastContainer, toast } from "react-toastify"
import { HiOutlinePencilSquare } from "react-icons/hi2"
import { FaTrashAlt } from "react-icons/fa"

const ControlTab = ({ levels, setLevels }) => {
    const [questions, setQuestions] = useState([])
    const [grades, setGrades] = useState([])

    const [grade, setGrade] = useState({ name: "", min_point: null, max_point: null })

    const [modalQuestion, setModalQuestion] = useState("")
    const [hardness, setHardness] = useState("")
    const [point, setPoint] = useState()
    const [loading, setLoading] = useState(false)

    const modalRef = useRef(null)

    const handleGradeChange = (name, value) => {
        setGrade((prev) => ({ ...prev, [name]: value }))
    }


    const openModal = (url) => {
        modalRef.current.showModal()
        setModalQuestion(url)
    }

    const closeModal = () => {
        setModalQuestion("")
        modalRef.current.close()
    }

    const addHard = async () => {
        if (hardness && point) {
            setLoading(true)
            const result = await addHardness({ name: hardness, point })
            setLoading(false)
            if (result.status === 200) {
                toast.success("Сложность добавлено!")
                setPoint(null)
                setHardness("")
            }
        } else {
            toast.error("Заполните все поля!")
        }
    }

    const addGrd = async () => {
        if (grade.max_point && grade.min_point && grade.name) {
            setLoading(true)
            const result = await addGrade(grade)
            if (result.status === 200) {
                toast.success("Грейд добавлено!")
                setGrades((prev) => ([...prev, { ...grade }]))
                setGrade({ name: "", min_point: null, max_point: null })
            } else {
                toast.error("Попробуй позже!")
            }
        } else {
            toast.error("Заполните все поля!")
        }
    }

    const deltGrade = async (id) => {
        const response = await deleteGrade({ id });

        if (response.status === 200) {
            toast.success("Грейд удалено!")
            setGrades((prev) => ([...prev].filter((el) => el.id !== id)))
        } else {
            toast.error("Попробуй чут позже")
        }
    }

    const delHardness = async (id) => {
        const response = await deleteHardness(id);
        if (response.status === 200) {
            toast.success("Cложност удалено!")
            setLevels((prev) => ([...prev].filter((el) => el.id !== id)))
        } else {
            toast.error("Попробуй чут позже")
        }
    }

    const delQuestion = async (id) => {
        const response = await deleteQuestion(id)
        if (response.status === 200) {
            toast.success("Вопрос удалено!")
            setQuestions((prev) => ([...prev].filter((el) => el.id !== id)))
        } else {
            toast.error("Попробуй чут позже")
        }
    }


    useEffect(() => {
        fetchQuestions().then((qsn) => {
            setQuestions(qsn)
        })
        getGrades().then((rs) => {
            setGrades(rs)
        })
    }, [])

    return (
        <div className="pt-6">
            <p className={`text-xl font-medium text-gray-500`}>Сложносты</p>
            <ToastContainer />
            <div className="my-4">
                <input disabled={loading} value={hardness} onChange={(e) => setHardness(e.target.value)} className="py-1 disabled:opacity-50 disabled:cursor-not-allowed px-2" type="text" placeholder="Уровен" />
                <input disabled={loading} value={point} onChange={(e) => setPoint(+e.target.value)} type="text" className="py-1 disabled:opacity-50 disabled:cursor-not-allowed px-2 ml-2" placeholder="Балл" />
                <button disabled={loading} onClick={addHard} className="border disabled:opacity-50 disabled:cursor-not-allowed py-1 px-4 ml-2" type="button">Добавить</button>
            </div>
            <table className="bg-white shadow">
                <thead>
                    <tr>
                        <th className="p-2">Уровен</th>
                        <th className="p-2">Балл</th>
                        <th className="p-2">Изменит</th>
                        <th className="p-2">Удалить</th>
                    </tr>
                </thead>
                <tbody>

                    {levels?.length ? levels.map((lvl) => (
                        <tr>
                            <td className="p-2">{lvl.name}</td>
                            <td className="p-2">{lvl.point}</td>
                            <td className="p-2"><button className="mx-auto"><HiOutlinePencilSquare /></button></td>
                            <td className="p-2"><button className="hover:bg-gray-400" onClick={() => delHardness(lvl.id)}><FaTrashAlt /></button></td>
                        </tr>
                    )) : <p>Нету уровны пока!</p>}
                </tbody>
            </table>
            <dialog ref={modalRef}>
                <div className="flex flex-col">

                    <p onClick={closeModal} className="m-3 self-end cursor-pointer">X</p>
                    <img className="m-4" src={"https://s3.regru.cloud/uigrade/" + modalQuestion} />
                </div>
            </dialog>
            <p className="text-xl font-medium pt-4 pb-4 text-gray-500">Вопросы</p>
            {questions.length ? questions.map((question) => (
                <div className="flex px-4 justify-between items-center shadow bg-white py-2 rounded gap-4 mb-4">
                    {question.question_text && <p>{question.question_text}</p>}
                    <p>{question.level}</p>
                    <div className="flex gap-2">

                        <img onClick={() => openModal(question.image1)} className="w-20 cursor-pointer hover:scale-[1.03] h-20 border-2 border-green-600" src={"https://s3.regru.cloud/uigrade/" + question.image1} alt="" />
                        <img onClick={() => openModal(question.image2)} className="w-20 cursor-pointer hover:scale-[1.03] h-20 border-2 border-red-600" src={"https://s3.regru.cloud/uigrade/" + question.image2} alt="" />

                        <button onClick={() => delQuestion(question.id)} type="button" className="border self-center px-2">Удалить</button>
                    </div>
                </div>
            )) : <p>0 вопросы</p>}

            <p className="text-xl font-medium pt-4 pb-4 text-gray-500">Грейди</p>

            <div className="my-4">
                <input value={grade.name} name="name" onChange={(e) => handleGradeChange(e.target.name, e.target.value)} className="py-1 disabled:opacity-50 disabled:cursor-not-allowed px-2" type="text" placeholder="Грейд" />
                <input value={grade.min_point} name="min_point" onChange={(e) => handleGradeChange(e.target.name, e.target.value)} type="text" className="py-1 disabled:opacity-50 disabled:cursor-not-allowed px-2 ml-2" placeholder="Мин балл" />
                <input value={grade.max_point} name="max_point" onChange={(e) => handleGradeChange(e.target.name, e.target.value)} type="text" className="py-1 disabled:opacity-50 disabled:cursor-not-allowed px-2 ml-2" placeholder="Макс балл" />
                <button onClick={addGrd} className="border disabled:opacity-50 disabled:cursor-not-allowed py-1 px-4 ml-2" type="button">Добавить</button>
            </div>
            <table className="bg-white shadow">
                <thead>
                    <tr>
                        <th className="p-2">Грейд</th>
                        <th className="p-2">Мин</th>
                        <th className="p-2">Макс</th>
                        <th className="p-2">Изменить</th>
                        <th className="p-2">Удалить</th>
                    </tr>
                </thead>
                <tbody>
                    {grades?.length ? grades.map((grd) => (
                        <tr>
                            <td className="p-2">{grd.name}</td>
                            <td className="p-2">{grd.min_point}</td>
                            <td className="p-2">{grd.max_point}</td>
                            <td className="p-2"><button className="mx-auto"><HiOutlinePencilSquare /></button></td>
                            <td className="p-2"><button onClick={() => deltGrade(grd.id)} className="hover:bg-gray-400"><FaTrashAlt /></button></td>
                        </tr>
                    )) : <p>Нету грейд пока!</p>}
                </tbody>
            </table>
        </div>
    )
}

export default ControlTab