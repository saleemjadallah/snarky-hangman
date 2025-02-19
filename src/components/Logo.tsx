
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
}

export const Logo = ({ className, variant = "dark" }: LogoProps) => {
  const colorScheme = variant === "light" 
    ? { primary: "#FFFFFF", secondary: "#D6BCFA" }
    : { primary: "#1A1F2C", secondary: "#9b87f5" };

  return (
    <Link 
      to="/"
      className={cn("inline-flex items-center gap-2 transition-opacity hover:opacity-80", className)}
      onClick={(e) => {
        e.preventDefault();
        window.location.href = '/';
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
      >
        {/* Noose forming 'H' */}
        <path
          d="M8 6C8 4.89543 8.89543 4 10 4H12C13.1046 4 14 4.89543 14 6V26C14 27.1046 13.1046 28 12 28H10C8.89543 28 8 27.1046 8 26V6Z"
          fill={colorScheme.primary}
        />
        <path
          d="M18 6C18 4.89543 18.8954 4 20 4H22C23.1046 4 24 4.89543 24 6V26C24 27.1046 23.1046 28 22 28H20C18.8954 28 18 27.1046 18 26V6Z"
          fill={colorScheme.primary}
        />
        <path
          d="M8 14H24"
          stroke={colorScheme.primary}
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Mischievous character */}
        <circle
          cx="26"
          cy="8"
          r="3"
          fill={colorScheme.secondary}
          className="animate-bounce"
        />
        <path
          d="M25 7.5C25 7.5 25.5 8 26 8C26.5 8 27 7.5 27 7.5"
          stroke={colorScheme.primary}
          strokeWidth="0.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex items-center">
        <span 
          className={cn(
            "text-xl font-black tracking-wide transform -rotate-[15deg] translate-y-1 -translate-x-1",
            "font-['Permanent_Marker',cursive] text-secondary",
            "select-none hover:scale-110 transition-transform duration-200"
          )}
          style={{
            textShadow: `1px 1px 0 ${colorScheme.primary}`,
          }}
        >
          Snarky
        </span>
        <span 
          className={cn(
            "text-xl font-semibold tracking-wide ml-1",
            variant === "light" ? "text-white" : "text-primary"
          )}
        >
          Hangman
        </span>
      </div>
    </Link>
  );
};
