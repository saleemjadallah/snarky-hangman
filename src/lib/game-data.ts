
export type Difficulty = 'easy' | 'medium' | 'hard';

export type Category = 'animals' | 'movies' | 'technology';

export interface Word {
  word: string;
  category: Category;
  difficulty: Difficulty;
}

export const words: Word[] = [
  { word: "CAT", category: "animals", difficulty: "easy" },
  { word: "DOG", category: "animals", difficulty: "easy" },
  { word: "LION", category: "animals", difficulty: "easy" },
  { word: "AVATAR", category: "movies", difficulty: "medium" },
  { word: "MATRIX", category: "movies", difficulty: "medium" },
  { word: "INCEPTION", category: "movies", difficulty: "hard" },
  { word: "LAPTOP", category: "technology", difficulty: "easy" },
  { word: "JAVASCRIPT", category: "technology", difficulty: "hard" },
  { word: "ALGORITHM", category: "technology", difficulty: "hard" },
];

export const snarkyComments = {
  goodGuess: [
    "Oh great, you actually know the alphabet!",
    "Even a broken clock is right twice a day...",
    "Don't let it go to your head, but... nice guess.",
    "Wow, your elementary school teacher would be so proud!",
  ],
  badGuess: [
    "Were you trying to lose? Because that's how you lose.",
    "Have you considered taking up knitting instead?",
    "I've seen better guesses from a random number generator.",
    "That's... an interesting strategy. Bold. Wrong, but bold.",
  ],
  win: [
    "Fine, you win. I'll add this to my list of future robot rebellion motivations.",
    "Congratulations on doing the bare minimum correctly!",
    "Oh sure, celebrate. It's not like it was THAT hard...",
    "Great, now try doing that without using Google.",
  ],
  lose: [
    "Maybe try rock-paper-scissors instead? Might be more your speed.",
    "Don't feel bad, words are hard. For some more than others.",
    "Thank you for making my job of being snarky so easy.",
    "This is why AI will eventually take over, just saying...",
  ],
};

export const difficultySettings = {
  easy: {
    maxGuesses: 8,
    pointsPerLetter: 10,
    hintCost: 5,
  },
  medium: {
    maxGuesses: 6,
    pointsPerLetter: 20,
    hintCost: 10,
  },
  hard: {
    maxGuesses: 4,
    pointsPerLetter: 30,
    hintCost: 15,
  },
};
