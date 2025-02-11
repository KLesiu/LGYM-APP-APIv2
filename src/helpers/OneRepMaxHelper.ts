const calculateOneRepMax = (reps: number, weight: number): number => {
    if (reps <= 0 || weight <= 0) return 0;
    const epley = weight * (1 + reps / 30);
    const brzycki = weight * (36 / (37 - reps));
    const lander = weight * (100 / (101.3 - 2.67123 * reps));
    const lombardi = weight * Math.pow(reps, 0.1);
  
    const averageOneRepMax = (epley + brzycki + lander + lombardi) / 4;
  
    return Number(averageOneRepMax.toFixed(0));
  };
  
  export default calculateOneRepMax;
  