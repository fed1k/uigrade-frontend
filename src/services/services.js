const BASE_API_URL = import.meta.env.VITE_API_URL

export const fetchQuestions = async () => {
    const url = BASE_API_URL + "/questions"
    const response = await fetch(url)
    const data = await response.json();
    return data
}

export const checkAnswer = async (answer) => {
    const url = BASE_API_URL + "/check";
    const response = await fetch(url, {
        method: "POST", body: answer,
        headers: {
            "Content-Type": "application/json", // Set content type to JSON
        }
    })
    const data = await response.json();
    return data
}