
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, setGuestName } = useAuth();

  const isValidUsername = username.length >= 2 && username.length <= 30;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = isValidUsername && isValidEmail && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    await signUp(email, username);
    setIsLoading(false);
    onClose();
  };

  const playAsGuest = () => {
    if (isValidUsername) {
      setGuestName(username);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to Snarky Hangman!</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Just two quick things and you'll be ready to challenge our snarky AI!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="username">What should we call you?</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your nickname"
              className="w-full"
            />
            {username && !isValidUsername && (
              <p className="text-sm text-red-500">
                Names need to be 2-30 characters long (we can't just call you '{username}'!)
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Your email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Where should we send your magic link?"
              className="w-full"
            />
            {email && !isValidEmail && (
              <p className="text-sm text-red-500">
                Oops! That email doesn't look quite right
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground italic text-center">
            We'll only use your email to save your progress and amazing victories (or hilarious defeats). No spam, promise! 😉
          </p>
          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting ready...
                </>
              ) : (
                "Start Playing!"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={playAsGuest}
              disabled={!isValidUsername}
            >
              Just play as guest
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
