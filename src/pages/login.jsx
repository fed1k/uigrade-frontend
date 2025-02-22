import axios from "axios";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
const apiUrl = import.meta.env.VITE_API_URL;

const LoginPage = () => {
    const [file1, setFile1] = useState()
    const [file2, setFile2] = useState()
    const [others, setOthers] = useState({question_text: "", level: ""})

    const handleOtherInputsChange = ({target}) => {
        setOthers((prev) => ({...prev, [target.name]: target.value}))
    }

    const upload = async (event) => {
        event.preventDefault()
        // const file = event.target.files[0];
        const formData = new FormData();
        formData.append("image1", file1);  // 'file' should match the name on the backend
        formData.append("image2", file2);  // 'file' should match the name on the backend
        // console.log(formData, others)
        formData.append("question_text", others.question_text)
        formData.append("level", others.level)
        fetch(apiUrl + "/questions", {
            method: "POST",
            body: formData,
        }).then((res) => res.json()).then((res) => console.log(res))
    }

    const handleChange1 = (file) => {
        setFile1(file)
    }

    const handleChange2 = (file) => {
        setFile2(file)
    }

    return (
        <form className="flex flex-col gap-3 items-center" onSubmit={upload}  >
            <input onChange={handleOtherInputsChange} type="text" name="question_text" placeholder="Question" />
            <input onChange={handleOtherInputsChange} type="text" name="level" placeholder="Level" />
            <div className="grid grid-cols-2 gap-4 h-80">
                <p>✔</p>
                <p>❌</p>
                <FileUploader
                    handleChange={handleChange1}
                    name="file"
                    types={["jpg", "jpeg", "png", "webp"]}
                    label={"Upload or drop a image right here"}
                    required
                    classes="h-full"
                    fileOrFiles={file1}
                />
                <FileUploader
                    handleChange={handleChange2}
                    name="file"
                    types={["jpg", "jpeg", "png", "webp"]}
                    label={"Upload or drop a image right here"}
                    required
                    fileOrFiles={file2}
                />
            </div>
            <button className="border border-gray-300">Upload</button>
        </form>
    )
}

export default LoginPage