import { useEffect, useRef, useState } from "react"
import { addGrade, addHardness, deleteGrade, deleteHardness, deleteQuestion, editGrade, editHardness, editQuestion, fetchQuestions, getGrades } from "../services/services"
import { ToastContainer, toast } from "react-toastify"
import { Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "./ui/table"

import { Dialog, DialogContent, DialogClose } from "./ui/dialog"
import { Textarea } from "./ui/textarea"

const ControlTab = ({ levels, setLevels }) => {
    const [questions, setQuestions] = useState([])
    const [grades, setGrades] = useState([])

    const [grade, setGrade] = useState({ name: "", min_point: null, max_point: null })

    const [modalQuestion, setModalQuestion] = useState("")
    const [hardness, setHardness] = useState("")
    const [point, setPoint] = useState()
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false)
    const [editHardnressData, setEditHardnessData] = useState({
        id: null,
        newName: "",
        point: null
    })

    const [editGradeData, setEditGradeData] = useState({
        id: null,
        newName: "",
        min_point: null,
        max_point: null
    })

    // Add a new state for editing questions
    const [isQuestionEditDialogOpen, setIsQuestionEditDialogOpen] = useState(false)
    const [editQuestionData, setEditQuestionData] = useState({
        id: null,
        question_text: "",
        level: "",
        level_id: "",
        desc: "",
        image1: "",
        image2: "",
        currentImage1: "",
        currentImage2: "",
        imageChanged: {
            image1: false,
            image2: false,
        },
    })

    const closeModalRef = useRef(null)


    const handleEdit = (value) => {
        setIsEditDialogOpen(true)
        setEditHardnessData({ ...value, newName: value.name })
    }

    const handleEditChange = (name, value) => {
        setEditHardnessData((prev) => ({ ...prev, [name]: value }))
    }

    const handleEditGrade = (value) => {
        setIsGradeDialogOpen(true)
        setEditGradeData({ ...value, newName: value.name })
    }

    const handleEditGradeChange = (name, value) => {
        setEditGradeData((prev) => ({ ...prev, [name]: value }))
    }

    const handleGradeChange = (name, value) => {
        setGrade((prev) => ({ ...prev, [name]: value }))
    }


    const openModal = (url) => {
        setIsDialogOpen(true)
        setModalQuestion(url)
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

    const savehardnessEdit = async () => {
        setLoading(true)
        const response = await editHardness(editHardnressData)
        setLoading(false)
        closeModalRef?.current?.click()
        if (response.status === 200) {
            setLevels(levels.map(level => {
                if (level.id === editHardnressData.id) {
                    return { name: editHardnressData.newName, id: editHardnressData.id, point: editHardnressData.point }; // Replace `updatedLevel` with the updated value for the current level
                }
                return level;
            }));
            setQuestions(questions.map((el) => {
                if (el.level_id == editHardnressData.id) {
                    return { ...el, level: editHardnressData.newName }
                }
                return el
            }))
        } else {
            toast.error("Попробуй чут позже")
        }
    }

    // Add this function to save question edits
    const saveQuestionEdit = async () => {
        setLoading(true)

        // Create FormData to handle file uploads
        const formData = new FormData()
        formData.append("id", editQuestionData.id)
        formData.append("question_text", editQuestionData.question_text)
        formData.append("level", editQuestionData.level)
        formData.append("level_id", editQuestionData.level_id)
        formData.append("desc", editQuestionData.desc)
        formData.append("image1", editQuestionData.image1)
        formData.append("image2", editQuestionData.image2)

        // if (editQuestionData.imageChanged.image1) {
        // }

        // if (editQuestionData.imageChanged.image2) {
        // }

        // Replace with your actual API call
        const response = await editQuestion(formData)

        if (response.status === 200) {
            toast.success("Вопрос обновлен!")

            // Update the questions state with the edited question
            setQuestions(
                questions.map((q) => {
                    if (q.id === editQuestionData.id) {
                        return {
                            ...q,
                            question_text: editQuestionData.question_text,
                            level: editQuestionData.level,
                            image1: editQuestionData.imageChanged.image1 ? response.data.image1 : q.image1,
                            image2: editQuestionData.imageChanged.image2 ? response.data.image2 : q.image2,
                        }
                    }
                    return q
                }),
            )

            setIsQuestionEditDialogOpen(false)
        } else {
            toast.error("Ошибка при обновлении вопроса")
        }
        setLoading(false)
    }

    const saveGradeEdit = async () => {
        setLoading(true)
        const response = await editGrade(editGradeData)
        setLoading(false)
        // close modal here
        closeModalRef?.current?.click()
        if (response.status === 200) {
            setGrades(grades.map(grd => {
                if (grd.id === editGradeData.id) {
                    return { name: editGradeData.newName, id: editGradeData.id, min_point: editGradeData.min_point, max_point: editGradeData.max_point }; // Replace `updatedLevel` with the updated value for the current level
                }
                return grd;
            }));
        } else {
            toast.error("Попробуй чут позже")
        }
    }

    // Add this function to handle editing questions
    const handleEditQuestion = (question) => {
        setIsQuestionEditDialogOpen(true)
        setEditQuestionData({
            id: question.id,
            question_text: question.question_text || "",
            level: levels.find(el => el.id === question.level_id)?.name || "",
            level_id: question.level_id,
            desc: question.desc,
            image1: "",
            image2: "",
            currentImage1: question.image1,
            currentImage2: question.image2,
            imageChanged: {
                image1: false,
                image2: false,
            },
        })
    }

    // Add this function to handle image file selection
    const handleImageChange = (e, imageType) => {
        const file = e.target.files[0]
        if (file) {
            setEditQuestionData((prev) => ({
                ...prev,
                [imageType]: file,
                imageChanged: {
                    ...prev.imageChanged,
                    [imageType]: true,
                },
            }))
        }
    }

    // Add this function to handle question data changes
    const handleEditQuestionChange = (name, value) => {
        setEditQuestionData((prev) => ({ ...prev, [name]: value }))
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
        <div className="space-y-8 py-6">
            <ToastContainer />
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-medium text-gray-700">Сложносты</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3 mb-6">
                        <Input
                            disabled={loading}
                            value={hardness}
                            onChange={(e) => setHardness(e.target.value)}
                            className="max-w-xs"
                            placeholder="Уровен"
                        />
                        <Input
                            disabled={loading}
                            value={point}
                            onChange={(e) => setPoint(+e.target.value)}
                            type="number"
                            className="max-w-xs"
                            placeholder="Балл"
                        />
                        <Button disabled={loading} onClick={addHard} variant="outline">
                            Добавить
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Уровен</TableHead>
                                    <TableHead>Балл</TableHead>
                                    <TableHead className="w-[100px]">Изменит</TableHead>
                                    <TableHead className="w-[100px]">Удалить</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {levels?.length ? (
                                    levels.map((lvl) => (
                                        <TableRow key={lvl.id}>
                                            <TableCell>{lvl.name}</TableCell>
                                            <TableCell>{lvl.point}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleEdit(lvl)} variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => delHardness(lvl.id)}
                                                    className="text-destructive hover:text-destructive/90"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                            Нету уровны пока!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-medium text-gray-700">Вопросы</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {questions.length ? (
                            questions.map((question) => (
                                <div
                                    key={question.id}
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg border bg-card"
                                >
                                    <div className="flex-1 min-w-0">
                                        {question.question_text && <p className="font-medium truncate">{question.question_text}</p>}
                                        <p className="text-sm text-muted-foreground">Уровень: {question.level}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 items-center">
                                        <div className="flex gap-2">
                                            <div
                                                onClick={() => openModal(question.image1)}
                                                className="relative w-16 h-16 rounded-md overflow-hidden border-2 border-emerald-500 cursor-pointer transition-transform hover:scale-105"
                                            >
                                                <img
                                                    src={"https://s3.regru.cloud/uigrade/" + question.image1}
                                                    alt="Correct answer"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div
                                                onClick={() => openModal(question.image2)}
                                                className="relative w-16 h-16 rounded-md overflow-hidden border-2 border-rose-500 cursor-pointer transition-transform hover:scale-105"
                                            >
                                                <img
                                                    src={"https://s3.regru.cloud/uigrade/" + question.image2}
                                                    alt="Wrong answer"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Add this edit button */}
                                        <Button
                                            onClick={() => handleEditQuestion(question)}
                                            variant="outline"
                                            size="sm"
                                            className="text-primary border-primary hover:bg-primary/10"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            onClick={() => delQuestion(question.id)}
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive border-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            {/* Удалить */}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">0 вопросы</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-medium text-gray-700">Грейди</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3 mb-6">
                        <Input
                            value={grade.name}
                            name="name"
                            onChange={(e) => handleGradeChange(e.target.name, e.target.value)}
                            className="max-w-xs"
                            placeholder="Грейд"
                        />
                        <Input
                            value={grade.min_point}
                            name="min_point"
                            onChange={(e) => handleGradeChange(e.target.name, +e.target.value)}
                            type="number"
                            className="max-w-xs"
                            placeholder="Мин балл"
                        />
                        <Input
                            value={grade.max_point}
                            name="max_point"
                            onChange={(e) => handleGradeChange(e.target.name, +e.target.value)}
                            type="number"
                            className="max-w-xs"
                            placeholder="Макс балл"
                        />
                        <Button onClick={addGrd} variant="outline">
                            Добавить
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Грейд</TableHead>
                                    <TableHead>Мин</TableHead>
                                    <TableHead>Макс</TableHead>
                                    <TableHead className="w-[100px]">Изменить</TableHead>
                                    <TableHead className="w-[100px]">Удалить</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {grades?.length ? (
                                    grades.map((grd) => (
                                        <TableRow key={grd.id}>
                                            <TableCell>{grd.name}</TableCell>
                                            <TableCell>{grd.min_point}</TableCell>
                                            <TableCell>{grd.max_point}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleEditGrade(grd)} variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deltGrade(grd.id)}
                                                    className="text-destructive hover:text-destructive/90"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                            Нету грейд пока!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {/* for previewing question image */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <div className="aspect-auto max-h-[80vh] overflow-auto">
                        <img
                            src={"https://s3.regru.cloud/uigrade/" + modalQuestion}
                            alt="Question image"
                            className="w-full h-auto"
                        />
                    </div>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogContent>
            </Dialog>

            {/* for editing hardness level */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white">
                    <div className="flex flex-wrap bg-white gap-3 mb-6">
                        <Input
                            disabled={loading}
                            value={editHardnressData.newName}
                            onChange={(e) => handleEditChange("newName", e.target.value)}
                            className="max-w-xs"
                            placeholder="Уровен"
                        />
                        <Input
                            disabled={loading}
                            value={editHardnressData.point}
                            onChange={(e) => handleEditChange("point", +e.target.value)}
                            type="number"
                            className="max-w-xs"
                            placeholder="Балл"
                        />
                        <Button disabled={loading} onClick={savehardnessEdit} variant="outline">
                            Сохранить
                        </Button>
                    </div>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <span ref={closeModalRef} className="sr-only">
                            Close
                        </span>
                    </DialogClose>
                </DialogContent>
            </Dialog>

            {/* for editing grade level */}
            <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white">
                    <div className="flex flex-wrap bg-white gap-3 mb-6">
                        <Input
                            disabled={loading}
                            value={editGradeData.newName}
                            onChange={(e) => handleEditGradeChange("newName", e.target.value)}
                            className="max-w-xs"
                            placeholder="Уровен"
                        />
                        <Input
                            disabled={loading}
                            value={editGradeData.min_point}
                            onChange={(e) => handleEditGradeChange("min_point", +e.target.value)}
                            type="number"
                            className="max-w-xs"
                            placeholder="Мин балл"
                        />
                        <Input
                            disabled={loading}
                            value={editGradeData.max_point}
                            onChange={(e) => handleEditGradeChange("max_point", +e.target.value)}
                            type="number"
                            className="max-w-xs"
                            placeholder="Макс балл"
                        />
                        <Button disabled={loading} onClick={saveGradeEdit} variant="outline">
                            Сохранить
                        </Button>
                    </div>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <span ref={closeModalRef} className="sr-only">
                            Close
                        </span>
                    </DialogClose>
                </DialogContent>
            </Dialog>

            {/* for editing questions */}
            <Dialog open={isQuestionEditDialogOpen} onOpenChange={setIsQuestionEditDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white">
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="question_text" className="text-sm font-medium">
                                Текст вопроса
                            </label>
                            <Input
                                id="question_text"
                                disabled={loading}
                                value={editQuestionData.question_text}
                                onChange={(e) => handleEditQuestionChange("question_text", e.target.value)}
                                placeholder="Текст вопроса"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="level" className="text-sm font-medium">
                                Уровень
                            </label>
                            <select
                                id="level"
                                disabled={loading}
                                value={editQuestionData.level}
                                onChange={(e) => handleEditQuestionChange("level", e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Выберите уровень</option>
                                {levels?.map((level) => (
                                    <option key={level.id} value={level.name}>
                                        {level.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Описание</label>
                            <Textarea
                                value={editQuestionData.desc}
                                onChange={(e) => handleEditQuestionChange("desc", e.target.value)}
                                placeholder="Введите описание вопроса"
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Правильный ответ (зеленый)</label>
                                <div className="flex flex-col gap-2">
                                    {editQuestionData.currentImage1 && (
                                        <div className="relative w-24 h-24 rounded-md overflow-hidden border-2 border-emerald-500">
                                            <img
                                                src={`https://s3.regru.cloud/uigrade/${editQuestionData.currentImage1}`}
                                                alt="Current correct answer"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, "image1")}
                                        className="text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Неправильный ответ (красный)</label>
                                <div className="flex flex-col gap-2">
                                    {editQuestionData.currentImage2 && (
                                        <div className="relative w-24 h-24 rounded-md overflow-hidden border-2 border-rose-500">
                                            <img
                                                src={`https://s3.regru.cloud/uigrade/${editQuestionData.currentImage2}`}
                                                alt="Current wrong answer"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, "image2")}
                                        className="text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button disabled={loading} onClick={saveQuestionEdit} className="w-full">
                            {loading ? "Сохранение..." : "Сохранить"}
                        </Button>
                    </div>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <span ref={closeModalRef} className="sr-only">
                            Close
                        </span>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ControlTab