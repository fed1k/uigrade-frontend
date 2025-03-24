export function updateProgress(currentQuestion, totalQuestions) {
  let percentage = (currentQuestion / totalQuestions) * 100;
  return Math.round(percentage)
}

export const randomizeImageOrders = (arr) => {

  arr.forEach(obj => {
    if (Math.random() > 0.5) {
      // Swap the values of image1 and image2 randomly
      const temp = obj.image1;
      obj.image1 = obj.image2;
      obj.image2 = temp;
    }
  });

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