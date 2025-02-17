
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileHeader } from "./profile/ProfileHeader";
import { GameStatistics } from "./profile/GameStatistics";
import { DeleteAccount } from "./profile/DeleteAccount";

export function ProfileMenu() {
  const { user, profile, signOut } = useAuth();

  if (!user || !profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full transition-all hover:scale-110"
        >
          <UserAvatar name={profile.username} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <ProfileHeader profile={profile} />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <GameStatistics profile={profile} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DeleteAccount userId={user.id} onDelete={signOut} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
