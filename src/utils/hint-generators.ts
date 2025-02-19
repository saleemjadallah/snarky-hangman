
import { Category } from "@/lib/game-data";

const categoryHints: Record<Category, string[]> = {
  animals: ["It might be your pet!", "Found in the wild", "Could be a farm animal"],
  science: ["Think laboratory", "Belongs in a textbook", "Used in experiments"],
  arts: ["Found in museums", "Used by creators", "Part of culture"],
  sports: ["Used in games", "Athletes need this", "Found on fields"],
  food: ["Might be in your kitchen", "Could be tasty", "Found in restaurants"],
  geography: ["Check your maps", "Part of the landscape", "Natural feature"],
  business: ["Think commerce", "Found in offices", "Part of trade"],
  health: ["Related to wellness", "Medical term", "Body system"],
  challenge: ["Try to beat this!", "Special word", "Friend's challenge"]
};

export const getSubCategoryHint = (category: Category, word: string) => {
  const relevantHints = categoryHints[category];
  return relevantHints[Math.floor(Math.random() * relevantHints.length)];
};

export const getLetterHint = (word: string, guessedLetters: string[]) => {
  const unguessedLetters = word
    .split("")
    .filter(letter => !guessedLetters.includes(letter));
  
  if (unguessedLetters.length === 0) return null;

  const vowels = unguessedLetters.filter(letter => "aeiou".includes(letter.toLowerCase()));
  if (vowels.length > 0) {
    return vowels[Math.floor(Math.random() * vowels.length)];
  }

  return unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
};

export const getWordPattern = (word: string, guessedLetters: string[]) => {
  const pattern = word.split("").map(letter => {
    if (guessedLetters.includes(letter)) return letter;
    return "_";
  }).join(" ");
  
  const context = word.length <= 4 ? "short word" : 
                 word.length <= 6 ? "medium word" : "long word";
  
  return `Pattern: ${pattern} (${context})`;
};

export const getSnarkyResponse = () => {
  const snarkyResponses = [
    "Need a little help? How adorable.",
    "Oh, looking for a lifeline already?",
    "Fine, I'll give you a tiny peek...",
    "I suppose even Einstein needed help sometimes... not with this though.",
  ];
  return snarkyResponses[Math.floor(Math.random() * snarkyResponses.length)];
};
