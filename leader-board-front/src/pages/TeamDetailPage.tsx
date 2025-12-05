import { Layout } from '@/components/layout/Layout';
import { TeamDetail } from '@/features/teams/TeamDetail';

export function TeamDetailPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <TeamDetail />
      </div>
    </Layout>
  );
}
