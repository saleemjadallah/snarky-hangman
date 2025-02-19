
interface IntroSectionProps {
  score: number;
}

export const IntroSection = ({ score }: IntroSectionProps) => {
  return (
    <>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Snarky Hangman</h1>
        <p className="text-muted-foreground">
          Can you outsmart the world's most condescending word game?
        </p>
        {score > 0 && (
          <p className="text-lg font-semibold text-secondary">Score: {score}</p>
        )}
      </div>

      <div className="max-w-[600px] mx-auto px-6 text-center space-y-4 animate-fade-in">
        <div className="flex flex-col items-center gap-6 mt-8">
          <SpeechBubble 
            message="Think you're a wordsmith? Let's see how you handle my carefully curated collection of confounding vocabulary."
            className="self-start ml-8"
          />
          <SpeechBubble 
            message="I've devoured dictionaries for breakfast and take peculiar joy in watching humans squirm."
            className="self-end mr-8"
          />
          <SpeechBubble 
            message="Choose your difficulty level, pick your avatar, and prepare to be lovingly mocked for every wrong guess."
            className="self-start ml-8"
          />
          <SpeechBubble 
            message="Don't worry though – even if you lose, you'll at least get a good laugh out of it."
            className="self-end mr-8"
          />
          <SpeechBubble 
            message="Ready to prove you're smarter than a particularly smug algorithm?"
            className="self-center font-semibold"
          />
        </div>
      </div>
    </>
  );
};
