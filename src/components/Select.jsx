import { useState } from "react";

const Select = ({ children, placeholder, value }) => {

    const [open, setOpen] = useState(false)

    const handleBlur = () => {
        setTimeout(() => {
            setOpen(false)
        }, 0)
    }

    return (
        <div className="relative">
            <input value={value} className="px-2 py-1" type="text" placeholder={placeholder} onFocus={() => setOpen(true)} onBlur={handleBlur} />
            <div className={`transition-all absolute bg-white w-full  shadow ${open ? "opacity-100 h-auto  z-10" : "h-0 opacity-0 -z-10"}`}>
                {children}
            </div>
        </div>
    )
}

export default Select;