import { Layout } from '@/components/layout/Layout';
import { Leaderboard } from '@/features/leaderboard/Leaderboard';

export function LeaderboardPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Leaderboard />
      </div>
    </Layout>
  );
}
