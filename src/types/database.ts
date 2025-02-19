
import { Difficulty } from "@/lib/game-data";

export interface Challenge {
  id: string;
  creator_id: string | null;
  word: string;
  difficulty: Difficulty;
  score: number;
  time_remaining: number;
  hints_used: number;
  created_at: string | null;
  expires_at: string | null;
  status: string | null;
}

export interface ChallengeAttempt {
  id: string;
  challenge_id: string | null;
  player_id: string | null;
  score: number;
  time_remaining: number;
  hints_used: number;
  completed_at: string | null;
  status: string | null;
}
