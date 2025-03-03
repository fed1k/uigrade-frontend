import { useState } from "react";

const Select = ({children, placeholder}) => {

    const [open, setOpen] = useState(false)

    return (
        <div className="relative">
            <input className="px-2 py-1" type="text" placeholder={placeholder} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} />
            <div className={`transition-all absolute bg-white w-full px-2 py-1 shadow ${open ? "opacity-100 h-auto  z-10" : "h-0 opacity-0 -z-10"}`}>
                {children}
            </div>
        </div>
    )
}

export default Select;