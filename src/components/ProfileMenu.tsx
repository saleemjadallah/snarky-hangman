
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "./UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { Edit2, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function ProfileMenu() {
  const { user, profile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(profile?.username || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user || !profile) return null;

  const handleSaveChanges = async () => {
    if (newUsername.length < 2 || newUsername.length > 30) {
      toast({
        title: "Invalid username",
        description: "Username must be between 2 and 30 characters",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    const { error } = await supabase
      .from('profiles')
      .update({ username: newUsername })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Oops! Couldn't save your changes",
        description: "Try again?",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated!",
        description: "Looking good!",
      });
      setIsEditing(false);
    }
    setIsUpdating(false);
  };

  const handleDeleteAccount = async () => {
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) {
      toast({
        title: "Error deleting account",
        description: "Something went wrong. Give it another shot!",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account deleted",
        description: "Sorry to see you go!",
      });
      signOut();
    }
  };

  const totalGames = 
    (profile.easy_games_played || 0) + 
    (profile.medium_games_played || 0) + 
    (profile.hard_games_played || 0);

  return (
    <>
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
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="h-8"
                      placeholder="Enter new name"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveChanges}
                      disabled={isUpdating}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{profile.username}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
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
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all of your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 focus:ring-red-600"
            >
              Yes, delete my account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
