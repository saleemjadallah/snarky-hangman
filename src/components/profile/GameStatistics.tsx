
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
    <DropdownMenuItem className="cursor-default w-full focus:bg-background">
      <div className="flex flex-col space-y-2 w-full bg-white p-2 rounded-lg">
        <p className="text-sm font-medium border-b pb-1">Game Statistics</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-muted/50 p-2 rounded">
            <p className="font-medium">Total Games</p>
            <p className="text-muted-foreground">{totalGames}</p>
          </div>
          <div className="bg-muted/50 p-2 rounded">
            <p className="font-medium">Total Score</p>
            <p className="text-muted-foreground">{profile.total_score}</p>
          </div>
          <div className="bg-muted/50 p-2 rounded">
            <p className="font-medium">Best Score</p>
            <p className="text-muted-foreground">{profile.best_score}</p>
          </div>
          <div className="bg-muted/50 p-2 rounded">
            <p className="font-medium">Last Played</p>
            <p className="text-muted-foreground">
              {profile.last_played_at
                ? format(new Date(profile.last_played_at), "MMM d, yyyy")
                : "Never"}
            </p>
          </div>
        </div>
        <div className="space-y-2 mt-2">
          <p className="text-sm font-medium border-b pb-1">Games by Difficulty</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-muted/50 p-2 rounded">
              <p className="font-medium text-xs">Easy Games</p>
              <p className="text-xs text-muted-foreground">
                {profile.easy_games_played || 0}
              </p>
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <p className="font-medium text-xs">Medium Games</p>
              <p className="text-xs text-muted-foreground">
                {profile.medium_games_played || 0}
              </p>
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <p className="font-medium text-xs">Hard Games</p>
              <p className="text-xs text-muted-foreground">
                {profile.hard_games_played || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DropdownMenuItem>
  );
}
