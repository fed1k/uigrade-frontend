import { useEffect, useState } from "react";
import { getStats } from "../services/services"
const AdminStatisticsTab = () => {

    const [stats, setStats] = useState([])

    useEffect(() => {
        getStats().then((res) => {
            setStats(res)
        })
    }, [])

    return (
        <div className="pt-6">

            <div className="flex justify-between items-center">

                <p>Статистика</p>
                <button className="border rounded px-2 py-1" type="button">Загрузить excel</button>
            </div>


            <div>
                <p>Телеграм переходов: {stats[0]?.tg_visit_count}</p>
            </div>

        </div>
    )
}

export default AdminStatisticsTab;