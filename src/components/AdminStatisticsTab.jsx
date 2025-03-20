import { useEffect, useState } from "react";
import { getStats } from "../services/services"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { Award, BarChart, Download, TrendingUp, Users } from "lucide-react";
import * as XLSX from 'xlsx';

const AdminStatisticsTab = () => {

    const [stats, setStats] = useState({
        tg_visit_count: null,
        totalResults: null,
        completeResults: null,
        averageScore: null
    })
    const [isLoading, setIsLoading] = useState(true)

    const handleDownload = () => {
        const ws = XLSX.utils.json_to_sheet([{
            "ТГ переходов": stats.tg_visit_count,
            "Обшие резултатов": stats.totalResults,
            "прошедших тест до конца": stats.completeResults,
            "средний балл": Math.round(+stats.averageScore)
        }]);

        // Adjust column widths based on the maximum length of the content in each column
        const range = XLSX.utils.decode_range(ws['!ref']); // Get the range of the sheet
        const colWidths = [];

        // Loop through the columns and calculate max length
        for (let col = range.s.c; col <= range.e.c; col++) {
            let maxLength = 0;
            // Loop through the rows and find the maximum length of the cell content for each column
            for (let row = range.s.r; row <= range.e.r; row++) {
                const cellAddress = { r: row, c: col };
                const cell = ws[XLSX.utils.encode_cell(cellAddress)];
                if (cell && cell.v) {
                    maxLength = Math.max(maxLength, String(cell.v).length);
                }
            }
            colWidths.push({ wpx: maxLength * 10 }); // Set column width (multiplied by 10 for spacing)
        }

        // Assign the calculated column widths to the worksheet
        ws['!cols'] = colWidths;

        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Write the Excel file and trigger the download
        // XLSX.writeFile(wb, 'data.xlsx');
        XLSX.writeFile(wb, 'статистика.xlsx');
    }

    useEffect(() => {
        getStats().then((res) => {
            if (res.status === 200) {
                setStats(res)
            }
            setIsLoading(false)
        })
    }, [])

    return (
        <div className="py-8">
            <div className="flex flex-col space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Статистика</h2>
                        <p className="text-muted-foreground mt-1">Обзор активности и результатов тестирования</p>
                    </div>

                    <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Загрузить excel
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i}>
                                <CardHeader className="pb-2">
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-10 w-1/3" />
                                    <Skeleton className="h-4 w-3/4 mt-2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Телеграм переходов</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">{stats.tg_visit_count || 0}</div>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </div>
                                {/* <p className="text-xs text-muted-foreground mt-2">
                  +{Math.floor(Math.random() * 10) + 1}% с прошлой недели
                </p> */}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Всего тестов</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">{stats.totalResults}</div>
                                    <BarChart className="h-4 w-4 text-muted-foreground" />
                                </div>
                                {/* <p className="text-xs text-muted-foreground mt-2">
                  +{Math.floor(Math.random() * 15) + 5}% с прошлого месяца
                </p> */}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Завершенных тестов</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">{stats.completeResults}</div>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </div>
                                {/* <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((mockStats.completed_assessments / mockStats.total_assessments) * 100)}% от общего числа
                </p> */}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Средний балл</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">{Math.round(+stats.averageScore)}</div>
                                    <Award className="h-4 w-4 text-muted-foreground" />
                                </div>
                                {/* <p className="text-xs text-muted-foreground mt-2">Из 100 возможных</p> */}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminStatisticsTab;