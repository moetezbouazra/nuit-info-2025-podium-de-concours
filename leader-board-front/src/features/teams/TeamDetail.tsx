import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Users,
  Trophy,
  Star,
  Calendar,
  Activity,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { formatPoints, formatDate } from '@/lib/utils';

export function TeamDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: team, isLoading, error } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      if (!id) throw new Error('Team ID is required');
      const result = await api.getTeam(id);
      return result.team;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status">
        <Spinner size="lg" />
        <span className="sr-only">Chargement de l'équipe...</span>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="text-center py-12" role="alert">
        <p className="text-[hsl(var(--destructive))]">
          Équipe introuvable
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/leaderboard">
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Retour au classement
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" asChild>
        <Link to="/leaderboard">
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Retour au classement
        </Link>
      </Button>

      {/* Team Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar
                src={team.avatarUrl}
                fallback={team.name}
                size="lg"
                className="h-20 w-20 text-2xl"
              />

              <div className="flex-1">
                <h1 className="text-3xl font-bold">{team.name}</h1>
                {team.description && (
                  <p className="text-[hsl(var(--muted-foreground))] mt-1">
                    {team.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <Badge variant="secondary" className="text-lg px-4 py-1">
                    <Trophy className="h-4 w-4 mr-2" aria-hidden="true" />
                    {formatPoints(team.score)} points
                  </Badge>

                  <span className="flex items-center gap-1 text-[hsl(var(--muted-foreground))]">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    {team.members?.length || 0} membre{(team.members?.length || 0) > 1 ? 's' : ''}
                  </span>

                  <span className="flex items-center gap-1 text-[hsl(var(--muted-foreground))]">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    Créée le {formatDate(team.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                Badges obtenus
              </CardTitle>
            </CardHeader>
            <CardContent>
              {team.achievements && team.achievements.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {team.achievements.map((ta, index) => (
                    <motion.div
                      key={ta.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--muted))]"
                    >
                      <div className="text-2xl">
                        {ta.achievement.icon === 'rocket' && '🚀'}
                        {ta.achievement.icon === 'compass' && '🧭'}
                        {ta.achievement.icon === 'terminal' && '💻'}
                        {ta.achievement.icon === 'shield' && '🛡️'}
                        {ta.achievement.icon === 'leaf' && '🌿'}
                        {ta.achievement.icon === 'users' && '👥'}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{ta.achievement.name}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          +{ta.achievement.points} pts
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-[hsl(var(--muted-foreground))]">
                  Aucun badge pour le moment
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" aria-hidden="true" />
                Membres
              </CardTitle>
            </CardHeader>
            <CardContent>
              {team.members && team.members.length > 0 ? (
                <div className="space-y-3">
                  {team.members.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      <Avatar fallback={member.name} size="sm" />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          {member.email}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-[hsl(var(--muted-foreground))]">
                  Aucun membre pour le moment
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" aria-hidden="true" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {team.activities && team.activities.length > 0 ? (
              <div className="space-y-3">
                {team.activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--muted))]"
                  >
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant={activity.points >= 0 ? 'success' : 'destructive'}
                    >
                      {activity.points >= 0 ? '+' : ''}
                      {activity.points} pts
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-[hsl(var(--muted-foreground))]">
                Aucune activité récente
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
