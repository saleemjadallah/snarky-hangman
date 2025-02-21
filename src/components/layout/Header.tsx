
import { Logo } from "@/components/Logo";
import { ProfileMenu } from "@/components/ProfileMenu";
import { Leaderboard } from "@/components/Leaderboard";
import { GameLimitCounter } from "@/components/game/GameLimitCounter";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const { user, isGuest, guestName, signOut } = useAuth();
  const displayName = guestName || "Player";

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-border z-50 px-4">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center">
        <div className="flex-shrink-0">
          <Logo />
        </div>

        <div className="flex items-center gap-6">
          {user && <GameLimitCounter />}
          <div className="relative flex items-center">
            <Leaderboard />
          </div>
          <div className="relative flex items-center">
            <ProfileMenu />
          </div>
          {!user && isGuest && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">
                Playing as guest: {displayName}
              </span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
