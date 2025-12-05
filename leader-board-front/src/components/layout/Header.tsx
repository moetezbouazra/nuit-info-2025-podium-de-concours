import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))]/60"
      role="banner"
    >
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-6">
          <Link
            to="/leaderboard"
            className="flex items-center gap-2 font-bold text-xl"
            aria-label="NIRD Gamification - Classement"
          >
            <Trophy className="h-6 w-6 text-[hsl(var(--primary))]" aria-hidden="true" />
            <span>NIRD</span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-4">
            <Link
              to="/leaderboard"
              className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              <Trophy className="h-4 w-4" aria-hidden="true" />
              Classement
            </Link>
          </nav>
        </div>

        <div className="text-sm text-[hsl(var(--muted-foreground))]">
          Nuit de l'Info 2025
        </div>
      </div>
    </header>
  );
}
