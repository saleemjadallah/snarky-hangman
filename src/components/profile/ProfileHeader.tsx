
import { useState } from "react";
import { Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Profile } from "@/types/auth";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(profile.username);
  const [isUpdating, setIsUpdating] = useState(false);

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
      .eq('id', profile.id);

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

  return (
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
  );
}
