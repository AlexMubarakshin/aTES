/**
 *  Generates fictional fee and cost values for a task based on quirky  🦜 parrot-related factors.
 */
export function generateTaskValues() {
  const averagePopugLifespanInYears = 50;
  const popugElevationRangeInMeters = 2000;

  const randomLifespanFactor = Math.random() * 2; // Random factor between 0 and 2
  const randomElevationFactor = Math.random() * 1.5; // Random factor between 0 and 1.5

  // Calculating the fee and cost using the absurd formula
  const fee = Math.round((averagePopugLifespanInYears + randomLifespanFactor) * 10); // Rounded to 10s
  const cost = Math.round((popugElevationRangeInMeters * randomElevationFactor) / 5); // Rounded to 5s

  return {fee, cost} as const;
}
