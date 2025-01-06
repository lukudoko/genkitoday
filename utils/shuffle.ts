export const shuffleArray = (array: any[]): any[] => {
  let shuffledArray: any[] = [...array]; // Clone the array to avoid mutation
  for (let i: number = shuffledArray.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
};