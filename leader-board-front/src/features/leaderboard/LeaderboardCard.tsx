import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, Medal, Users, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { cn, formatPoints, getRankBadge } from '@/lib/utils';
import type { LeaderboardTeam } from '@/types';

interface LeaderboardCardProps {
  team: LeaderboardTeam;
  previousRank?: number;
}

export function LeaderboardCard({ team, previousRank }: LeaderboardCardProps) {
  const rankChanged = previousRank !== undefined && previousRank !== team.rank;
  const movedUp = previousRank !== undefined && previousRank > team.rank;

  const getRankVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return 'gold';
      case 2:
        return 'silver';
      case 3:
        return 'bronze';
      default:
        return 'secondary';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5" aria-hidden="true" />;
      case 2:
      case 3:
        return <Medal className="h-5 w-5" aria-hidden="true" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        layout: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <Link to={`/teams/${team.id}`} className="block">
        <Card
          className={cn(
            'relative overflow-hidden transition-all hover:shadow-md cursor-pointer hover:scale-[1.01]',
            team.rank === 1 && 'ring-2 ring-yellow-400',
            team.rank === 2 && 'ring-2 ring-gray-300',
            team.rank === 3 && 'ring-2 ring-amber-500'
          )}
          role="article"
          aria-label={`${team.name}, rang ${team.rank}, ${team.score} points - Cliquez pour voir les détails`}
        >
        {/* Rank change indicator */}
        {rankChanged && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'absolute top-2 right-2 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              movedUp
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            )}
            aria-live="polite"
          >
            {movedUp ? (
              <>
                <motion.span
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  ↑
                </motion.span>
                <span className="sr-only">Monté de</span>
                {previousRank - team.rank}
              </>
            ) : (
              <>
                <motion.span
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  ↓
                </motion.span>
                <span className="sr-only">Descendu de</span>
                {team.rank - previousRank}
              </>
            )}
          </motion.div>
        )}

        <CardContent className="flex items-center gap-4 p-4">
          {/* Rank */}
          <div className="flex items-center justify-center w-12">
            <Badge
              variant={getRankVariant(team.rank)}
              className="flex items-center gap-1 text-lg font-bold"
            >
              {getRankIcon(team.rank)}
              <span>{getRankBadge(team.rank)}</span>
            </Badge>
          </div>

          {/* Team Avatar */}
          <Avatar
            src={team.avatarUrl}
            fallback={team.name}
            size="lg"
          />

          {/* Team Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{team.name}</h3>
            {team.description && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] truncate">
                {team.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" aria-hidden="true" />
                <span>
                  {team.memberCount} membre{team.memberCount > 1 ? 's' : ''}
                </span>
              </span>
              {team.achievements && team.achievements.length > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" aria-hidden="true" />
                  <span>{team.achievements.length} badge{team.achievements.length > 1 ? 's' : ''}</span>
                </span>
              )}
            </div>
          </div>

          {/* Score */}
          <motion.div
            key={team.score}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
            className="text-right"
          >
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">
              {formatPoints(team.score)}
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">points</div>
          </motion.div>
        </CardContent>

        {/* Progress bar to next rank */}
        {team.rank > 1 && (
          <div className="px-4 pb-4">
            <div className="h-1 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[hsl(var(--primary))]"
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
        )}
        </Card>
      </Link>
    </motion.div>
  );
}
