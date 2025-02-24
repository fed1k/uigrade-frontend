import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

const LoginPage = () => {
    const navigate = useNavigate()
    
    const handleSubmit = (e) => {
        e.preventDefault()
        const formdata = new FormData(e.target);

        // Если парол верно
        if (adminPassword === formdata.get("password")) {
            localStorage.setItem("valid", adminPassword)
            navigate("/admin")
            return
        }

        toast.error("У вас нет прав на доступ к этой странице")


    }

    useEffect(() => {
        if (localStorage.getItem("valid")) {
            navigate("/admin")
        }
    }, [])
    return (
        <form onSubmit={handleSubmit} className="flex items-center flex-col gap-2">
            <ToastContainer />
            <input type="password" className="px-2 py-0.5 outline-none" name="password" placeholder="Парол" />
            <button className="border px-6 py-0.5 rounded">Логин</button>
        </form>
    )
}

export default LoginPage