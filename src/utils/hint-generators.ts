
import { Category } from "@/lib/game-data";

export const getSubCategoryHint = (category: Category, word: string) => {
  const hints: Record<Category, string[]> = {
    animals: [
      "This creature is a mammal",
      "This is a sea creature",
      "This animal flies",
      "This is a domesticated animal",
      "This is a wild animal",
      "This creature is a reptile",
    ],
    science: [
      "This is a scientific process",
      "This is a scientific instrument",
      "This is a chemical element",
      "This is a scientific theory",
      "This relates to astronomy",
      "This is a biological term",
    ],
    arts: [
      "This is an art movement",
      "This is an artistic technique",
      "This relates to music",
      "This is a type of performance",
      "This is a famous artwork",
      "This is an artistic tool",
    ],
    sports: [
      "This is team sport equipment",
      "This is an individual sport",
      "This is a sports position",
      "This is a sporting technique",
      "This is a sports venue",
      "This is a sports rule term",
    ],
    food: [
      "This is a type of cuisine",
      "This is a cooking method",
      "This is a kitchen utensil",
      "This is a type of ingredient",
      "This is a dish type",
      "This is a spice or seasoning",
    ],
    geography: [
      "This is a landform",
      "This is a type of climate",
      "This relates to water bodies",
      "This is a geographic region",
      "This is a geographic term",
      "This relates to map features",
    ],
    business: [
      "This is a financial term",
      "This is a business role",
      "This is a type of transaction",
      "This is a business strategy",
      "This is an economic concept",
      "This is a market term",
    ],
    health: [
      "This is a medical condition",
      "This is a body part",
      "This is a medical procedure",
      "This is a health practice",
      "This is medical equipment",
      "This is a wellness term",
    ],
  };

  const relevantHints = hints[category];
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
