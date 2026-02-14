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

export { getRandomLetter, isExplicit }