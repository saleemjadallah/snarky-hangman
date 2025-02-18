
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
        <p className="text-[#2D3748] leading-relaxed text-base sm:text-lg">
          Think you're a wordsmith? Put your vocabulary to the test against our sarcastically superior AI. Fair warning: our AI has devoured dictionaries for breakfast and takes peculiar joy in watching humans squirm. Choose your difficulty level, pick your avatar, and prepare to be lovingly mocked for every wrong guess. Don't worry though – even if you lose, you'll at least get a good laugh out of it.
        </p>
        <p className="text-[#2D3748] font-medium text-base sm:text-lg">
          Ready to prove you're smarter than a particularly smug algorithm?
        </p>
      </div>
    </>
  );
};
