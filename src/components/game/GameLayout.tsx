
import { type ReactNode } from "react";
import { Header } from "@/components/layout/Header";

interface GameLayoutProps {
  children: ReactNode;
}

export const GameLayout = ({ children }: GameLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};
