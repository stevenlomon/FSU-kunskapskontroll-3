// Helper functions

// Prompt 25: Write a function that returns a random lowercase letter of the alphabet. I'm thinking an array containing all characters of the alphabet and using an equivalent to Python's random.choice
function getRandomLetter(): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  // The `!` tells TS to ignore the possibility of undefined
  return alphabet[Math.floor(Math.random() * alphabet.length)]!;
}

// Prompt 26: Write a helper function isExplicit. It takes a boolean `exp` as input argument and returns "explicit" if it is true, else "not explicit"
function isExplicit(exp: boolean): string {
    return exp ? "Explicit" : "Not Explicit";
}

// Prompt 30: Write a helper function convertMillisecondsDuration that takes `duration_ms` (integer/number) as its input argument, and returns a string on the format `${min_passed}:${seconds_remaining}`. The function should first convert the integer from milliseconds to seconds. Then use modulo with 60 to see how many whole minutes we have and how many leftover seconds. Then construct and return the resulting string.
function convertMillisecondsDuration(duration_ms: number): string {
  const totalSeconds = Math.floor(duration_ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export { getRandomLetter, isExplicit, convertMillisecondsDuration }