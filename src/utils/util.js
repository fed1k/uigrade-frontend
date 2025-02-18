export function updateProgress(currentQuestion, totalQuestions) {
    let percentage = (currentQuestion / totalQuestions) * 100;
    return Math.round(percentage)
}