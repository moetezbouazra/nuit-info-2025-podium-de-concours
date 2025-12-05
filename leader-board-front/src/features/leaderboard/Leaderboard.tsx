import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { Trophy, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { api } from '@/lib/api';
import { useLeaderboardSSE } from '@/lib/useLeaderboardSSE';
import { LeaderboardCard } from './LeaderboardCard';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import type { LeaderboardTeam } from '@/types';

export function Leaderboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousRanks, setPreviousRanks] = useState<Map<string, number>>(new Map());
  const previousLeaderboardRef = useRef<LeaderboardTeam[]>([]);

  // Subscribe to real-time leaderboard updates via SSE
  useLeaderboardSSE({
    onConnectionChange: (connected) => {
      setIsConnected(connected);
      if (connected) {
        setError(null);
      }
    },
    onError: (errorMsg) => {
      setError(errorMsg);
    },
  });

  // Use React Query for data - SSE hook updates this cache
  const { data: leaderboard = [], isLoading, refetch } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const result = await api.getLeaderboard();
      return result.leaderboard;
    },
    // When data changes, track previous ranks for animations
    select: (data) => {
      // Store previous ranks before update
      const prevRanks = new Map<string, number>();
      previousLeaderboardRef.current.forEach((team) => {
        prevRanks.set(team.id, team.rank);
      });
      if (prevRanks.size > 0 && previousRanks.size === 0) {
        setPreviousRanks(prevRanks);
      }

      // Update ref for next comparison
      previousLeaderboardRef.current = data;

      // Announce change to screen readers
      if (data.length > 0 && previousRanks.size > 0) {
        const announcement = document.getElementById('leaderboard-announcement');
        if (announcement) {
          announcement.textContent = 'Le classement a été mis à jour';
          setTimeout(() => {
            announcement.textContent = '';
          }, 1000);
        }
      }

      return data;
    },
  });

  // Manual refresh
  const handleRefresh = async () => {
    setError(null);
    await refetch();
  };

  if (isLoading && leaderboard.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status">
        <Spinner size="lg" />
        <span className="sr-only">Chargement du classement...</span>
      </div>
    );
  }

  if (error && leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4" role="alert">
        <p className="text-[hsl(var(--destructive))]">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <section aria-labelledby="leaderboard-heading">
      {/* Screen reader announcement for real-time updates */}
      <div
        id="leaderboard-announcement"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-[hsl(var(--primary))]" aria-hidden="true" />
          <h1 id="leaderboard-heading" className="text-3xl font-bold">
            Classement
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 text-sm ${
              isConnected ? 'text-green-600' : 'text-[hsl(var(--muted-foreground))]'
            }`}
            aria-label={isConnected ? 'Connecté en temps réel' : 'Déconnecté'}
          >
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Temps réel</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Déconnecté</span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            aria-label="Actualiser le classement"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Leaderboard podium for top 3 */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8" role="list" aria-label="Podium">
          {/* Second place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-1"
            role="listitem"
          >
            <div className="bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-lg p-4 text-center h-32 flex flex-col justify-end">
              <div className="text-4xl mb-2">🥈</div>
              <h3 className="font-bold truncate text-gray-800">{leaderboard[1].name}</h3>
              <p className="text-sm text-gray-600">{leaderboard[1].score} pts</p>
            </div>
          </motion.div>

          {/* First place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="order-2"
            role="listitem"
          >
            <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-t-lg p-4 text-center h-40 flex flex-col justify-end">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                className="text-5xl mb-2"
              >
                🏆
              </motion.div>
              <h3 className="font-bold truncate text-yellow-900">{leaderboard[0].name}</h3>
              <p className="text-sm text-yellow-800">{leaderboard[0].score} pts</p>
            </div>
          </motion.div>

          {/* Third place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-3"
            role="listitem"
          >
            <div className="bg-gradient-to-b from-amber-400 to-amber-600 rounded-t-lg p-4 text-center h-24 flex flex-col justify-end">
              <div className="text-3xl mb-2">🥉</div>
              <h3 className="font-bold truncate text-amber-900">{leaderboard[2].name}</h3>
              <p className="text-sm text-amber-800">{leaderboard[2].score} pts</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Full leaderboard list */}
      <div className="space-y-3" role="list" aria-label="Liste complète du classement">
        <AnimatePresence mode="popLayout">
          {leaderboard.map((team) => (
            <LeaderboardCard
              key={team.id}
              team={team}
              previousRank={previousRanks.get(team.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
          <p>Aucune équipe pour le moment</p>
        </div>
      )}
    </section>
  );
}
