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

export function cn(...args) {
    return args
      .filter(Boolean) // Filter out any falsy values (undefined, null, false, etc.)
      .map(arg => {
        if (typeof arg === 'string') {
          return arg; // Return the string as is
        }
        if (Array.isArray(arg)) {
          return cn(...arg); // If it's an array, recursively process each element
        }
        if (typeof arg === 'object') {
          return Object.keys(arg)
            .filter(key => arg[key]) // Only include keys with truthy values
            .join(' '); // Join the keys into a single space-separated string
        }
        return ''; // Return an empty string for any other type
      })
      .join(' ') // Join all parts with a space
      .trim(); // Remove extra spaces at the ends
  }