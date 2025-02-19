
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileSync } from "@/hooks/use-profile-sync";
import { GameLayout } from "@/components/game/GameLayout";
import { GameManager } from "@/components/game/GameManager";
import { ChallengeLoader } from "@/components/game/ChallengeLoader";
import { RegistrationModal } from "@/components/RegistrationModal";

const Index = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isGuest } = useAuth();

  // Use the profile sync hook
  useProfileSync();

  useEffect(() => {
    if (!user && !isGuest && !isLoading) {
      setShowRegistration(true);
    } else {
      setShowRegistration(false);
    }
  }, [user, isGuest, isLoading]);

  return (
    <GameLayout>
      <ChallengeLoader
        onSetDifficulty={() => {}} // These will be handled by recoil or context in a future update
        onSetCurrentWord={() => {}}
        onSetLoading={setIsLoading}
      />

      <GameManager />

      <RegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
      />
    </GameLayout>
  );
};

export default Index;
