export function updateProgress(currentQuestion, totalQuestions) {
    let percentage = (currentQuestion / totalQuestions) * 100;
    return Math.round(percentage)
}

export const randomizeImageOrders = (images) => {

    // Convert the object to an array of keys and shuffle
    const keys = Object.keys(images);
    keys.sort(() => Math.random() - 0.5); // Randomly sort the keys

    // Get the shuffled images based on the new order
    const shuffledImages = keys.map(key => images[key]);

    return shuffledImages;

}