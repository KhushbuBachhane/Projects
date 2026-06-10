import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Users, Phone } from 'lucide-react';
import Card from '../../components/ui/Card';
import { statsAPI } from '../../services/api';
import Spinner from '../../components/ui/Spinner';

const adminLinks = [
  { to: '/admin/reports', icon: FileText, title: 'Manage Reports', desc: 'Verify, update severity, delete fake reports' },
  { to: '/admin/users', icon: Users, title: 'Manage Users', desc: 'View users, change roles, remove accounts' },
  { to: '/admin/contacts', icon: Phone, title: 'Emergency Contacts', desc: 'Add and manage emergency contact numbers' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsAPI.get()
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="min-h-[60vh]" size="lg" />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
          <Shield className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage reports, users, and emergency contacts</p>
        </div>
      </div>

      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="text-center">
            <p className="text-2xl font-bold">{stats.totalDisasters}</p>
            <p className="text-sm text-gray-500">Total Reports</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.unverifiedDisasters}</p>
            <p className="text-sm text-gray-500">Pending Review</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.verifiedDisasters}</p>
            <p className="text-sm text-gray-500">Verified</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Users</p>
          </Card>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {adminLinks.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <Icon className="h-8 w-8 text-purple-600" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
