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

export const fetchLevels = async () => {
    const url = BASE_API_URL + "/hardness";
    const response = await fetch(url)
    const data = await response.json();

    return data
}

export const addHardness = async (data) => {
    const url = BASE_API_URL + "/hardness"
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json", // Set content type to JSON
        }
    })

    return response.json()
}

export const deleteHardness = async (id) => {
    const url = BASE_API_URL + "/hardness";
    const response = await fetch(url, {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
            "Content-Type": "application/json", // Set content type to JSON
        }
    })
    return response.json();
}

export const deleteQuestion = async (id) => {
    const url = BASE_API_URL + "/questions";
    const response = await fetch(url, {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
            "Content-Type": "application/json", // Set content type to JSON
        }
    })
    return response.json();
}

export const getGrades = async () => {
    const url = BASE_API_URL + "/grade";
    const response = await fetch(url);

    return response.json();
}

export const addGrade = async (data) => {
    const url = BASE_API_URL + "/grade";
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json", // Set content type to JSON
        }
    })

    return response.json();
}

export const deleteGrade = async(data) => {
    const url = BASE_API_URL + "/grade";
    const response = await fetch(url, {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json", // Set content type to JSON
        }
    })

    return response.json();
}

export const getStats = async() => {
    const url = BASE_API_URL + "/stats";
    const response = await fetch(url);
    const data= await response.json();

    return data
}

export const incrementTgVisitCount = async () => {
    const url = BASE_API_URL + "/tg_visit";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Set content type to JSON
        }
    })
    return response.json()
}

export const initResult = async() => {
    const url = BASE_API_URL + "/result";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Set content type to JSON
        }
    })
    return response.json()
}

export const getResult = async(result_id) => {
    const url = BASE_API_URL + `/result/${result_id}`;
    const response = await fetch(url);
    return response.json();
}

export const getResults = async() => {
    const url = BASE_API_URL + "/result";
    const response = await fetch(url);
    return response.json()
}