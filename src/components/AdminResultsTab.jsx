import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Award, CheckCircle2, ChevronDown, Clock, XCircle, BarChart3, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Button } from "../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { getResults } from "../services/services"


export default function AdminResultsTab() {
  // Sample data from the provided JSON
  //   const [initialData, setInitialData] = useState([])
  //   const initialData = [
  //     {
  //       id: 1,
  //       score: 0,
  //       grade: "Junior",
  //       timestamp: "2025-03-14T21:38:42.788Z",
  //       status: "progress",
  //       correct_count: 0,
  //       wrong_count: 0,
  //       createdAt: "2025-03-14T21:38:42.790Z",
  //       updatedAt: "2025-03-14T21:38:42.790Z",
  //     },
  //     {
  //       id: 2,
  //       score: 2,
  //       grade: "Junior",
  //       timestamp: "2025-03-14T21:41:36.275Z",
  //       status: "progress",
  //       correct_count: 1,
  //       wrong_count: 0,
  //       createdAt: "2025-03-14T21:41:36.276Z",
  //       updatedAt: "2025-03-14T21:43:48.861Z",
  //     },
  //     {
  //       id: 3,
  //       score: 0,
  //       grade: "Senior",
  //       timestamp: "2025-03-15T21:44:06.935Z",
  //       status: "completed",
  //       correct_count: 0,
  //       wrong_count: 0,
  //       createdAt: "2025-03-15T21:44:06.936Z",
  //       updatedAt: "2025-03-15T21:44:06.936Z",
  //     },
  //   ]

  const [assessments, setAssessments] = useState([])
  const [filter, setFilter] = useState("all")

  // Filter assessments by grade
  const filteredAssessments =
    filter === "all"
      ? assessments
      : assessments.filter((assessment) =>
        filter === "unspecified" ? assessment.grade === "unspecified" : assessment.grade === filter,
      )

  // Helper function to get grade-specific styling
  const getGradeStyles = (grade) => {
    switch (grade.toLowerCase()) {
      case "junior":
        return {
          bgGradient: "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20",
          border: "border-emerald-200 dark:border-emerald-800",
          badge: "bg-emerald-500 hover:bg-emerald-600",
          icon: "text-emerald-600 dark:text-emerald-400",
        }
      case "middle":
        return {
          bgGradient: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          badge: "bg-blue-500 hover:bg-blue-600",
          icon: "text-blue-600 dark:text-blue-400",
        }
      case "senior":
        return {
          bgGradient: "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20",
          border: "border-purple-200 dark:border-purple-800",
          badge: "bg-purple-500 hover:bg-purple-600",
          icon: "text-purple-600 dark:text-purple-400",
        }
      default:
        return {
          bgGradient: "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/30",
          border: "border-gray-200 dark:border-gray-700",
          badge: "bg-gray-500 hover:bg-gray-600",
          icon: "text-gray-600 dark:text-gray-400",
        }
    }
  }

  // Calculate total questions attempted
  const getTotalQuestions = (assessment) => {
    return assessment.correct_count + assessment.wrong_count
  }

  // Calculate completion percentage
  const getCompletionPercentage = (assessment) => {
    const total = getTotalQuestions(assessment)
    return total > 0 ? Math.round((assessment.correct_count / total) * 100) : 0
  }

  useEffect(() => {
    getResults().then((res) => {
      // console.log(res)
      if (res.status === 200) {
        setAssessments(res.data)
      }
    })
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Результаты оценки</h1>
            <p className="text-muted-foreground mt-1">
              Отслеживайте свой прогресс и результаты на разных уровнях мастерства
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Filter by Grade
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="bg-white cursor-pointer hover:bg-[hsl(214.3_31.8%_91.4%)]" onClick={() => setFilter("all")}>All Grades</DropdownMenuItem>
                <DropdownMenuItem className="bg-white cursor-pointer hover:bg-[hsl(214.3_31.8%_91.4%)]" onClick={() => setFilter("Junior")}>Junior</DropdownMenuItem>
                <DropdownMenuItem className="bg-white cursor-pointer hover:bg-[hsl(214.3_31.8%_91.4%)]" onClick={() => setFilter("Middle")}>Middle</DropdownMenuItem>
                <DropdownMenuItem className="bg-white cursor-pointer hover:bg-[hsl(214.3_31.8%_91.4%)]" onClick={() => setFilter("Senior")}>Senior</DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => setFilter("unspecified")}>Unspecified</DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => {
            const styles = getGradeStyles(assessment.grade)
            const totalQuestions = getTotalQuestions(assessment)
            const completionPercentage = getCompletionPercentage(assessment)

            return (
              <Card
                key={assessment.id}
                className={`overflow-hidden border ${styles.border} transition-all duration-300 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/10`}
              >
                <div className={`${styles.bgGradient} absolute top-0 left-0 right-0 h-2`} />
                <CardHeader className="pt-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Award className={`h-5 w-5 ${styles.icon}`} />
                        Оценка #{assessment.id}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(assessment.timestamp), "MMM d, yyyy • h:mm a")}
                      </CardDescription>
                    </div>
                    <Badge className={styles.badge + " text-white"}>
                      {assessment.grade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Балл</span>
                      </div>
                      <div className="text-2xl font-bold">{assessment.score}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Progress</span>
                        </div>
                        <span className="font-medium">{assessment.status}</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background border">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Правилний</span>
                        </div>
                        <span className="text-xl font-bold">{assessment.correct_count}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background border">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>Неправилнойs</span>
                        </div>
                        <span className="text-xl font-bold">{assessment.wrong_count}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredAssessments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Award className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No assessments found</h3>
            <p className="text-muted-foreground mt-1">No assessments match your current filter criteria</p>
            <Button variant="outline" className="mt-4" onClick={() => setFilter("all")}>
              Show All Assessments
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}