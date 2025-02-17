
import { format } from "date-fns";
import { Profile } from "@/types/auth";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface GameStatisticsProps {
  profile: Profile;
}

export function GameStatistics({ profile }: GameStatisticsProps) {
  const totalGames = 
    (profile.easy_games_played || 0) + 
    (profile.medium_games_played || 0) + 
    (profile.hard_games_played || 0);

  return (
    <DropdownMenuItem className="cursor-default">
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium">Game Statistics</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <p>Total Games: {totalGames}</p>
          <p>Total Score: {profile.total_score}</p>
          <p>Best Score: {profile.best_score}</p>
          <p>
            Last Played:{" "}
            {profile.last_played_at
              ? format(new Date(profile.last_played_at), "MMM d, yyyy")
              : "Never"}
          </p>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-xs text-muted-foreground">
            Easy Games: {profile.easy_games_played || 0}
          </p>
          <p className="text-xs text-muted-foreground">
            Medium Games: {profile.medium_games_played || 0}
          </p>
          <p className="text-xs text-muted-foreground">
            Hard Games: {profile.hard_games_played || 0}
          </p>
        </div>
      </div>
    </DropdownMenuItem>
  );
}
