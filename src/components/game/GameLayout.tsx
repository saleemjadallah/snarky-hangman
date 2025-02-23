
import { type ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";

interface GameLayoutProps {
  children: ReactNode;
}

export const GameLayout = ({ children }: GameLayoutProps) => {
  const { user, isGuest } = useAuth();
  const hasExtraBar = user || (isGuest && window.innerWidth < 640);
  
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className={`px-4 pb-8 ${hasExtraBar ? 'pt-32' : 'pt-24'}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};
