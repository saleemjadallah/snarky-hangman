
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DeleteAccountProps {
  userId: string;
  onDelete: () => void;
}

export function DeleteAccount({ userId, onDelete }: DeleteAccountProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    const { error } = await supabase.auth.admin.deleteUser(userId);
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
      onDelete();
    }
  };

  return (
    <>
      <DropdownMenuItem
        className="text-red-600 focus:text-red-600"
        onClick={() => setShowDeleteConfirm(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Account
      </DropdownMenuItem>

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
