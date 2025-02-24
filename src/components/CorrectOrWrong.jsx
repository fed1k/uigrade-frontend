import { RxCross1 } from "react-icons/rx"
import { TiTick } from "react-icons/ti"

const CorrectOrWrong = ({ answer }) => {
    if (answer && answer === "correct") return <p className="text-center flex justify-center items-center gap-2 pb-2 text-[#16A34A]">
        <div className="w-6 h-6 bg-[#BBF7D0] p-2 flex justify-center items-center rounded-full">
            <TiTick className="scale-[2]" />
        </div>
        Правилно</p>
    if (answer && answer !== "correct") return <p className="text-center pb-2 text-[#DC2626] flex justify-center items-center gap-2">
        <div className="w-6 h-6 bg-[#FECACA]  p-2 flex justify-center items-center rounded-full">

        <RxCross1 className="scale-[2]" />
        </div>
        Неправилно</p>

}

export default CorrectOrWrong