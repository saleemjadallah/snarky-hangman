
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Gamepad2 } from "lucide-react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

interface GameLimitState {
  gamesPlayed: number;
  gamesLimit: number;
  nextReset: Date | null;
}

type ProfileUpdate = {
  daily_games_played: number;
  daily_games_limit: number;
  next_reset_time: string | null;
}

export const GameLimitCounter = () => {
  const [limitState, setLimitState] = useState<GameLimitState>({
    gamesPlayed: 0,
    gamesLimit: 10,
    nextReset: null
  });
  const [timeUntilReset, setTimeUntilReset] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchGameLimit = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('daily_games_played, daily_games_limit, next_reset_time')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching game limit:', error);
      return;
    }

    console.log('Fetched game limit data:', data);

    setLimitState({
      gamesPlayed: data.daily_games_played || 0,
      gamesLimit: data.daily_games_limit || 10,
      nextReset: data.next_reset_time ? new Date(data.next_reset_time) : null
    });
  };

  const updateTimeUntilReset = () => {
    if (!limitState.nextReset) return;

    const now = new Date();
    const diff = limitState.nextReset.getTime() - now.getTime();
    
    if (diff <= 0) {
      fetchGameLimit();
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeUntilReset(`${hours}h ${minutes}m`);
  };

  useEffect(() => {
    fetchGameLimit();
    
    const channel = supabase
      .channel('profile-game-limits')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user?.id}`
        },
        (payload: RealtimePostgresChangesPayload<Database['public']['Tables']['profiles']['Update']>) => {
          console.log('Received profile update:', payload);
          
          const newData = payload.new;
          if (newData && typeof newData === 'object' && 'daily_games_played' in newData) {
            setLimitState({
              gamesPlayed: newData.daily_games_played ?? 0,
              gamesLimit: newData.daily_games_limit ?? 10,
              nextReset: newData.next_reset_time ? new Date(newData.next_reset_time) : null
            });
          }
        }
      )
      .on(
        'broadcast',
        { event: 'game-completed' },
        ({ payload }) => {
          console.log('Game completed event received:', payload);
          if (payload.user_id === user?.id) {
            fetchGameLimit();
          }
        }
      )
      .subscribe();

    // Refresh game limit every minute
    const refreshInterval = setInterval(fetchGameLimit, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(refreshInterval);
    };
  }, [user]);

  useEffect(() => {
    const timer = setInterval(updateTimeUntilReset, 60000);
    updateTimeUntilReset();
    return () => clearInterval(timer);
  }, [limitState.nextReset]);

  useEffect(() => {
    const remaining = limitState.gamesLimit - limitState.gamesPlayed;
    
    if (remaining === 3) {
      toast({
        title: "Running low on games!",
        description: "Still 3 chances to prove you're not completely hopeless!",
      });
    } else if (remaining === 2) {
      toast({
        title: "Almost out of games!",
        description: "Only 2 games left? Better make them count!",
        variant: "destructive",
      });
    } else if (remaining === 1) {
      toast({
        title: "Last game of the day!",
        description: "Last chance of the day to impress me (low bar, really)",
        variant: "destructive",
      });
    }
  }, [limitState.gamesPlayed]);

  const getProgressColor = () => {
    const remaining = limitState.gamesLimit - limitState.gamesPlayed;
    if (remaining <= 0) return "bg-destructive";
    if (remaining <= 2) return "bg-orange-500";
    if (remaining <= 5) return "bg-yellow-500";
    return "bg-green-500";
  };

  const remaining = limitState.gamesLimit - limitState.gamesPlayed;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-foreground/60" />
          <span className="text-sm font-medium">
            {remaining} / {limitState.gamesLimit} games left
          </span>
        </div>
        {timeUntilReset && (
          <div className="flex items-center gap-1 text-xs text-foreground/60">
            <Clock className="w-3 h-3" />
            <span>Resets in {timeUntilReset}</span>
          </div>
        )}
      </div>
      <div className="w-24 h-2 bg-background rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getProgressColor()}`}
          style={{
            width: `${(limitState.gamesPlayed / limitState.gamesLimit) * 100}%`
          }}
        />
      </div>
    </div>
  );
};
