
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileHeader } from "./profile/ProfileHeader";
import { GameStatistics } from "./profile/GameStatistics";
import { DeleteAccount } from "./profile/DeleteAccount";
import { LogIn } from "lucide-react";

export function ProfileMenu() {
  const { user, profile, signOut, isGuest, guestName } = useAuth();

  // Add console logs to debug authentication state
  console.log("Auth state:", { user, profile, isGuest, guestName });

  // If we have a user but no profile, we should wait for the profile to load
  if (user && !profile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full transition-all hover:scale-110"
          >
            <UserAvatar name="Loading..." />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuItem className="flex flex-col space-y-4 p-4">
            <div className="text-center">
              <p className="text-sm font-medium">Loading profile...</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full transition-all hover:scale-110"
        >
          <UserAvatar name={profile?.username || guestName || "Guest"} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        {profile ? (
          <>
            <ProfileHeader profile={profile} />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <GameStatistics profile={profile} />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DeleteAccount userId={user!.id} onDelete={signOut} />
          </>
        ) : isGuest ? (
          <DropdownMenuItem className="flex flex-col space-y-4 p-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Playing as {guestName}</p>
              <p className="text-xs text-muted-foreground mb-4">
                Sign in to save your progress and compete on the leaderboard
              </p>
              <Button variant="default" size="sm" onClick={() => window.location.reload()}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </div>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="flex flex-col space-y-4 p-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Welcome to Snarky Hangman!</p>
              <p className="text-xs text-muted-foreground mb-4">
                Sign in to track your progress and compete with others
              </p>
              <Button variant="default" size="sm" onClick={() => window.location.reload()}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
