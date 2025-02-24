import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const AdminPage = () => {
    const [file1, setFile1] = useState()
    const [file2, setFile2] = useState()
    const [others, setOthers] = useState({ question_text: "", level: "" })


    const navigate = useNavigate()

    const handleOtherInputsChange = ({ target }) => {
        setOthers((prev) => ({ ...prev, [target.name]: target.value }))
    }

    const upload = async (event) => {
        event.preventDefault()
        // const file = event.target.files[0];
        const formData = new FormData();
        formData.append("image1", file1);  // 'file' should match the name on the backend
        formData.append("image2", file2);  // 'file' should match the name on the backend
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

    useEffect(() => {
        if (!localStorage.getItem("valid")) {
            navigate("/")
        }
    }, [])

    return (
        <form className="flex flex-col gap-3 items-center" onSubmit={upload}  >
            <input className="px-2 py-0.5" onChange={handleOtherInputsChange} type="text" name="question_text" placeholder="Question" />
            <input className="px-2 py-0.5" onChange={handleOtherInputsChange} type="text" name="level" placeholder="Level" />
            <div>

                <div className="flex gap-4">
                    <p className="flex-1 pl-10 pb-6">✔</p>
                    <p className="flex-1">❌</p>
                </div>
                <div className="flex gap-4">

                    <div>

                        <FileUploader
                            handleChange={handleChange1}
                            name="file"
                            types={["jpg", "jpeg", "png", "webp"]}
                            label={"Upload or drop a image right here"}
                            required

                            classes="h-full"
                            fileOrFiles={file1}
                        />
                    </div>
                    <div>

                        <FileUploader
                            handleChange={handleChange2}
                            name="file"
                            types={["jpg", "jpeg", "png", "webp"]}
                            label={"Upload or drop a image right here"}
                            required
                            fileOrFiles={file2}
                        />
                    </div>
                </div>
            </div>
            <button className="border px-6 py-0.5 rounded">Upload</button>
        </form>
    )
}

export default AdminPage