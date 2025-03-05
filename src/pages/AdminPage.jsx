import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useNavigate } from "react-router-dom";
import Select from "../components/Select";
import { fetchLevels } from "../services/services";
import { ToastContainer, toast } from "react-toastify";
import ControlTab from "../components/AdminControlTab";
const apiUrl = import.meta.env.VITE_API_URL;

const AdminPage = () => {
    const [file1, setFile1] = useState()
    const [file2, setFile2] = useState()
    const [questionText, setQuestionText] = useState("")

    const [levels, setLevels] = useState([])

    const [activeTab, setActiveTab] = useState(0);

    const [selectedLevel, setSelectedLevel] = useState({ name: "", id: null })


    const navigate = useNavigate()

    const upload = async (event) => {
        event.preventDefault()

        if (!selectedLevel.name || !file1 || !file2) {
            toast.error("Заполните все обязательные поля")
            return
        }
        const formData = new FormData();
        formData.append("image1", file1);  // 'file' should match the name on the backend
        formData.append("image2", file2);  // 'file' should match the name on the backend
        formData.append("question_text", questionText)
        formData.append("level", selectedLevel.id)
        fetch(apiUrl + "/questions", {
            method: "POST",
            body: formData,
        }).then((res) => res.json()).then((res) => {
            if (res.status === 200) {
                toast.success("Вопрос добавлен!")
                event.target.reset()
            } else {
                toast.error("Что-то пошло не так. Попробуйте еще раз")
            }
        })
    }

    const handleChange1 = (file) => {
        setFile1(file)
    }

    const handleChange2 = (file) => {
        setFile2(file)
    }

    useEffect(() => {
        fetchLevels().then((res) => {
            setLevels(res)
        })

        if (!localStorage.getItem("valid")) {
            navigate("/")
        }
    }, [])

    return (
        <>
            <nav className="flex justify-center space-x-4">
                <p className={`border-b cursor-pointer ${activeTab === 0 ? "border-b-gray-700" : "border-b-transparent"}`} onClick={() => setActiveTab(0)}>Добавить вопрос</p>
                <p className={`border-b cursor-pointer ${activeTab === 1 ? "border-b-gray-700" : "border-b-transparent"}`} onClick={() => setActiveTab(1)}>Управление</p>
                <p className={`border-b cursor-pointer ${activeTab === 2 ? "border-b-gray-700" : "border-b-transparent"}`} onClick={() => setActiveTab(2)}>Статистика</p>
            </nav>
            <ToastContainer />
            {

                activeTab === 0 &&
                <form className="flex flex-col gap-3 items-center" onSubmit={upload}  >
                    <div className="flex gap-4 mt-6">

                        <input value={questionText} className="px-2 py-0.5" onChange={(e) => setQuestionText(e.target.value)} type="text" name="question_text" placeholder="Question" />
                        <Select placeholder="Level" value={selectedLevel.name}>
                            {levels.length ? levels.map((level) => (
                                <p className="cursor-pointer px-2 py-1 hover:bg-gray-50" onClick={() => setSelectedLevel({ name: level.name, id: level.id })}>{level.name} <span className="text-gray-400">({level.point})</span></p>
                            )) : <p className="text-sm text-gray-400">Уровен сложность нет</p>}
                        </Select>

                        <button className="border px-4 rounded">Добавить</button>
                    </div>
                    <div>

                        <div className="flex gap-4">
                            <p className="flex-1 pl-10 pb-6">✔</p>
                            <p className="flex-1">❌</p>
                        </div>
                        <div className="flex gap-4">

                            <div>

                                <FileUploader
                                    handleChange={handleChange1}
                                    name="file"
                                    types={["jpg", "jpeg", "png", "webp"]}
                                    label={"Upload or drop a image right here"}
                                    required

                                    classes="h-full"
                                    fileOrFiles={file1}
                                />
                            </div>
                            <div>

                                <FileUploader
                                    handleChange={handleChange2}
                                    name="file"
                                    types={["jpg", "jpeg", "png", "webp"]}
                                    label={"Upload or drop a image right here"}
                                    required
                                    fileOrFiles={file2}
                                />
                            </div>
                        </div>
                    </div>
                </form>}

            {activeTab === 1 && <ControlTab levels={levels} setLevels={setLevels} />}
        </>
    )
}

export default AdminPage