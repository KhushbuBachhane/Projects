import { Link } from 'react-router-dom';
import { AlertTriangle, Map, FileText, Shield, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import DisasterMap from '../components/map/DisasterMap';
import { DisasterCardLink } from '../components/disasters/DisasterCard';
import { disasterAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: Map, title: 'Live Map', desc: 'Interactive map with real-time disaster markers' },
  { icon: AlertTriangle, title: 'Instant Alerts', desc: 'Socket.IO powered real-time notifications' },
  { icon: FileText, title: 'Report Disasters', desc: 'Submit reports with photos and GPS location' },
  { icon: Shield, title: 'Verified Reports', desc: 'Admin-verified data you can trust' },
];

export default function Home() {
  const { user } = useAuth();
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    disasterAPI.getAll({ limit: 50 })
      .then(({ data }) => setDisasters(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const recentReports = disasters.slice(0, 6);
  const mapCenter = disasters.length
    ? [disasters[0].latitude, disasters[0].longitude]
    : [20.5937, 78.9629];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-4 py-20 text-white sm:px-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Real-Time Disaster Alerts
            </h1>
            <p className="mt-4 text-lg text-brand-100">
              Monitor, report, and respond to disasters in your area. Stay informed with live updates and interactive maps.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#live-map"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-brand-700 shadow-sm transition-colors hover:bg-brand-50"
              >
                View Live Map <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/map">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Full Map View
                </Button>
              </Link>
              {user ? (
                <Link to="/report">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Report Disaster
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold">Why DisasterWatch?</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30">
                <Icon className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="live-map"
        className="scroll-mt-20 bg-gray-100 px-4 py-16 dark:bg-gray-900/50 sm:px-6"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Live Disaster Map</h2>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {loading
                  ? 'Loading disaster reports...'
                  : `${disasters.length} active report${disasters.length === 1 ? '' : 's'} on the map — search any country to explore`}
              </p>
            </div>
            <Link
              to="/map"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Open full map <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6">
            {loading ? (
              <Spinner className="py-20" />
            ) : (
              <DisasterMap
                disasters={disasters}
                center={mapCenter}
                zoom={disasters.length ? 5 : 4}
                height="480px"
                showSearch
              />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Reports</h2>
          <Link to="/disasters" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentReports.map((d) => (
            <DisasterCardLink key={d._id} disaster={d} />
          ))}
          {!loading && !recentReports.length && (
            <p className="col-span-full text-center text-gray-500 py-10">No disaster reports yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
