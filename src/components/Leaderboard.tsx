
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Trophy, Crown, Zap, Medal, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAvatar } from "./UserAvatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeaderboardEntry {
  id: string;
  username: string;
  total_score: number;
  best_score: number;
  current_streak: number;
  longest_streak: number;
  perfect_games: number;
  favorite_difficulty: string | null;
  total_games: number;
  avg_score_per_game: number;
  global_rank: number;
}

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState("global");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: rankings, isLoading, refetch: refetchRankings } = useQuery({
    queryKey: ["leaderboard", activeTab],
    enabled: !!user,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("global_rankings")
          .select("*")
          .order("total_score", { ascending: false })
          .limit(100);

        if (error) {
          console.error("Leaderboard fetch error:", error);
          throw error;
        }

        return data as LeaderboardEntry[];
      } catch (error: any) {
        toast({
          title: "Error loading leaderboard",
          description: "Please try again later",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const { data: userRank, refetch: refetchUserRank } = useQuery({
    queryKey: ["userRank", user?.id],
    enabled: !!user,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("global_rankings")
          .select("*")
          .eq("id", user!.id)
          .single();

        if (error) {
          console.error("User rank fetch error:", error);
          throw error;
        }

        return data as LeaderboardEntry;
      } catch (error: any) {
        toast({
          title: "Error loading your rank",
          description: "Please try again later",
          variant: "destructive",
        });
        return null;
      }
    },
  });

  const handleRefresh = async () => {
    await Promise.all([refetchRankings(), refetchUserRank()]);
    toast({
      title: "Leaderboard Refreshed",
      description: "Scores have been updated with the latest data",
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button 
          className="relative inline-flex items-center justify-center p-2 text-sm font-medium transition-all hover:scale-110 rounded-full hover:bg-muted"
          aria-label="Open Leaderboard"
        >
          <Trophy className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="sr-only">Leaderboard</span>
          {userRank && (
            <Badge variant="secondary" className="absolute -top-2 -right-2">
              #{userRank.global_rank}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader className="relative">
          <SheetTitle>Leaderboard</SheetTitle>
          <SheetDescription>
            See how you stack up against other players!
          </SheetDescription>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleRefresh}
                  className="absolute right-0 top-0 p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Refresh Scores"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Scores</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SheetHeader>
        
        <Tabs defaultValue="global" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-4">
            <ScrollArea className="h-[500px] rounded-md border p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  Loading...
                </div>
              ) : !rankings?.length ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No rankings available yet
                </div>
              ) : (
                <div className="space-y-4">
                  {rankings.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                        user?.id === entry.id
                          ? "bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex-none w-8 text-center font-bold">
                        {index + 1}
                        {index < 3 && (
                          <span className="ml-1">
                            {index === 0 && <Crown className="inline h-4 w-4 text-yellow-500" />}
                            {index === 1 && <Medal className="inline h-4 w-4 text-gray-400" />}
                            {index === 2 && <Medal className="inline h-4 w-4 text-amber-600" />}
                          </span>
                        )}
                      </div>
                      <UserAvatar name={entry.username} className="h-8 w-8" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {entry.username}
                          {entry.perfect_games > 0 && (
                            <Zap className="inline h-4 w-4 ml-1 text-yellow-500" />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Games: {entry.total_games} • Streak: {entry.current_streak}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{entry.total_score.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Avg: {Math.round(entry.avg_score_per_game)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="weekly">
            <div className="h-[500px] flex items-center justify-center text-muted-foreground">
              Weekly rankings coming soon!
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <div className="h-[500px] flex items-center justify-center text-muted-foreground">
              Daily rankings coming soon!
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
