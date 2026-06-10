import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Users, Clock } from 'lucide-react';
import { statsAPI } from '../services/api';
import { StatCard, CategoryChart, SeverityChart, TrendChart } from '../components/dashboard/Charts';
import { DisasterCardLink } from '../components/disasters/DisasterCard';
import Spinner from '../components/ui/Spinner';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsAPI.get()
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="min-h-[60vh]" size="lg" />;
  if (!stats) return <p className="py-20 text-center text-gray-500">Failed to load dashboard data.</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">Overview of disaster reports and statistics</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Reports" value={stats.totalDisasters} icon={AlertTriangle} color="brand" />
        <StatCard title="Verified" value={stats.verifiedDisasters} icon={CheckCircle} color="green" />
        <StatCard title="Unverified" value={stats.unverifiedDisasters} icon={Clock} color="yellow" />
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="brand" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryChart data={stats.byCategory} />
        <SeverityChart data={stats.bySeverity} />
      </div>

      <div className="mt-6">
        <TrendChart data={stats.last7Days} />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Recent Reports</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.recentDisasters.map((d) => (
            <DisasterCardLink key={d._id} disaster={d} />
          ))}
        </div>
      </div>
    </div>
  );
}
