import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useNavigate } from "react-router-dom";
// import Select from "../components/Select";
import { fetchLevels } from "../services/services";
import { Upload, Settings, BarChart3, ListChecks } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

import { ToastContainer, toast } from "react-toastify";
import ControlTab from "../components/AdminControlTab";
import AdminStatisticsTab from "../components/AdminStatisticsTab";
import AdminResultsTab from "../components/AdminResultsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

const apiUrl = import.meta.env.VITE_API_URL;

const AdminPage = () => {
    const [file1, setFile1] = useState()
    const [file2, setFile2] = useState()
    const [questionText, setQuestionText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [levels, setLevels] = useState([])

    const [activeTab, setActiveTab] = useState("add-question");

    const [selectedLevel, setSelectedLevel] = useState({ name: "", id: null })


    const navigate = useNavigate()

    const upload = async (event) => {
        event.preventDefault()

        if (!selectedLevel.name || !file1 || !file2) {
            toast.error("Заполните все обязательные поля")
            return
        }



        setIsSubmitting(true)
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
                // event.target.reset()
            } else {
                toast.error("Что-то пошло не так. Попробуйте еще раз")
            }
        }).finally(() => {
            setIsSubmitting(false)
            setFile1(null)
            setFile2(null)
            setQuestionText("")
            setSelectedLevel({ name: "", id: null })

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
        <div className="container bg-white mx-auto py-6 px-4">
            <ToastContainer />
            <div className="flex flex-col space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Панель администратора</h1>
                    <p className="text-muted-foreground mt-1">Управление вопросами, уровнями сложности и просмотр результатов</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <TabsTrigger value="add-question" className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span className="hidden sm:inline">Добавить вопрос</span>
                            <span className="sm:hidden">Добавить</span>
                        </TabsTrigger>
                        <TabsTrigger value="control" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Управление</span>
                            <span className="sm:hidden">Управл.</span>
                        </TabsTrigger>
                        <TabsTrigger value="statistics" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Статистика</span>
                            <span className="sm:hidden">Стат.</span>
                        </TabsTrigger>
                        <TabsTrigger value="results" className="flex items-center gap-2">
                            <ListChecks className="h-4 w-4" />
                            <span className="hidden sm:inline">Результаты</span>
                            <span className="sm:hidden">Рез.</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="add-question">
                        <Card>
                            <CardHeader>
                                <CardTitle>Добавить новый вопрос</CardTitle>
                                <CardDescription>Загрузите правильный и неправильный варианты изображений</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={upload} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Текст вопроса</label>
                                            <Input
                                                value={questionText}
                                                onChange={(e) => setQuestionText(e.target.value)}
                                                placeholder="Введите текст вопроса"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Уровень сложности</label>
                                            <Select
                                                value={selectedLevel.id?.toString()}
                                                onValueChange={(value) => {
                                                    const level = levels.find((l) => l.id === Number.parseInt(value))
                                                    if (level) {
                                                        setSelectedLevel({ name: level.name, id: level.id })
                                                    }
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Выберите уровень" />
                                                </SelectTrigger>
                                                <SelectContent className=" bg-white">
                                                    {levels.length ? (
                                                        levels.map((level) => (
                                                            <SelectItem className="cursor-pointer hover:bg-[hsl(214.3_31.8%_91.4%)]" key={level.id} value={level.id.toString()}>
                                                                {level.name} ({level.point})
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            Уровни сложности не найдены
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="flex items-center justify-center text-sm font-medium text-green-600 mb-2">
                                                ✓ Правильный вариант
                                            </label>
                                            <div className="border-2 border-dashed border-green-200 rounded-lg p-4 hover:bg-green-50/50 transition-colors">
                                                <FileUploader
                                                    handleChange={handleChange1}
                                                    name="file1"
                                                    types={["jpg", "jpeg", "png", "webp"]}
                                                    fileOrFiles={file1}
                                                >
                                                    <div className="flex flex-col items-center justify-center py-4">
                                                        <Upload className="h-8 w-8 text-green-500 mb-2" />
                                                        <p className="text-sm text-center text-muted-foreground">
                                                            Перетащите файл или нажмите для выбора
                                                        </p>
                                                        {file1 && <p className="text-sm font-medium mt-2 text-green-600">{file1.name}</p>}
                                                    </div>
                                                </FileUploader>
                                            </div>
                                        </div>

                                        <div className="space-y-2 ">
                                            <label className="flex items-center justify-center text-sm font-medium text-rose-600 mb-2">
                                                ✗ Неправильный вариант
                                            </label>
                                            <div className="border-2 border-dashed border-rose-200 rounded-lg p-4 hover:bg-rose-50/50 transition-colors">
                                                <FileUploader
                                                    handleChange={handleChange2}
                                                    name="file2"
                                                    types={["jpg", "jpeg", "png", "webp"]}
                                                    fileOrFiles={file2}
                                                >
                                                    <div className="flex flex-col items-center justify-center py-4">
                                                        <Upload className="h-8 w-8 text-rose-500 mb-2" />
                                                        <p className="text-sm text-center text-muted-foreground">
                                                            Перетащите файл или нажмите для выбора
                                                        </p>
                                                        {file2 && <p className="text-sm font-medium mt-2 text-rose-600">{file2.name}</p>}
                                                    </div>
                                                </FileUploader>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !selectedLevel.id || !file1 || !file2}
                                            className="min-w-[120px] bg-[hsl(221.2_83.2%_53.3%)] text-white"
                                        >
                                            {isSubmitting ? "Загрузка..." : "Добавить"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="control">
                        <ControlTab levels={levels} setLevels={setLevels} />
                    </TabsContent>

                    <TabsContent value="statistics">
                        <AdminStatisticsTab />
                    </TabsContent>

                    <TabsContent value="results">
                        <AdminResultsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default AdminPage