
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Profile } from "@/types/auth";

export const useProfileSync = () => {
  const { user, setProfile } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('profile-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        async (payload) => {
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (updatedProfile) {
            const profile: Profile = {
              id: updatedProfile.id,
              username: updatedProfile.username,
              email: updatedProfile.email,
              avatar_url: null, // Set default value for avatar_url since it's not in the database yet
              total_score: updatedProfile.total_score || 0,
              best_score: updatedProfile.best_score || 0,
              perfect_games: updatedProfile.perfect_games || 0,
              current_streak: updatedProfile.current_streak || 0,
              longest_streak: updatedProfile.longest_streak || 0,
              easy_games_played: updatedProfile.easy_games_played || 0,
              medium_games_played: updatedProfile.medium_games_played || 0,
              hard_games_played: updatedProfile.hard_games_played || 0,
              last_played_at: updatedProfile.last_played_at || null,
              last_streak_update: updatedProfile.last_streak_update || null,
              created_at: updatedProfile.created_at,
              daily_score: updatedProfile.daily_score,
              favorite_difficulty: updatedProfile.favorite_difficulty,
              hints_used: updatedProfile.hints_used,
              updated_at: updatedProfile.updated_at,
              weekly_score: updatedProfile.weekly_score
            };
            setProfile(profile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
};
