import { useEffect, useRef, useState } from "react"
import { addGrade, addHardness, deleteGrade, deleteHardness, deleteQuestion, fetchQuestions, getGrades } from "../services/services"
import { ToastContainer, toast } from "react-toastify"
import { HiOutlinePencilSquare } from "react-icons/hi2"
import { FaTrashAlt } from "react-icons/fa"
import { Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "./ui/table"

import { Dialog, DialogContent, DialogClose } from "./ui/dialog"

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
    const [editHardnressData, setEditHardnessData] = useState({
        id: null,
        newName: "",
        point: null
    })


    const handleEdit = (value) => {
        setIsEditDialogOpen(true)
        setEditHardnessData({...value, newName: value.name})
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

    // grade => id, newName, min_point, max_point
    // hardness => id, newName, point


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
                                        <Button
                                            onClick={() => delQuestion(question.id)}
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive border-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Удалить
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
                                                <Button variant="ghost" size="icon">
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <div className="aspect-auto max-h-[80vh] overflow-auto">
                        <img src={"https://s3.regru.cloud/uigrade/" + modalQuestion} alt="Question image" className="w-full h-auto" />
                    </div>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white">
                    <div className="flex flex-wrap bg-white gap-3 mb-6">
                        <Input
                            disabled={loading}
                            value={editHardnressData.newName}
                            onChange={(e) => setHardness(e.target.value)}
                            className="max-w-xs"
                            placeholder="Уровен"
                        />
                        <Input
                            disabled={loading}
                            value={editHardnressData.point}
                            onChange={(e) => setPoint(+e.target.value)}
                            type="number"
                            className="max-w-xs"
                            placeholder="Балл"
                        />
                        <Button disabled={loading} onClick={addHard} variant="outline">
                            Добавить
                        </Button>
                    </div>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ControlTab