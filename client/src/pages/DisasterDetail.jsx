import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, User } from 'lucide-react';
import { disasterAPI } from '../services/api';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import DisasterMap from '../components/map/DisasterMap';
import { CATEGORY_ICONS, formatDate, getImageUrl } from '../utils/constants';

export default function DisasterDetail() {
  const { id } = useParams();
  const [disaster, setDisaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    disasterAPI.getById(id)
      .then(({ data }) => setDisaster(data.data))
      .catch(() => setError('Report not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner className="min-h-[60vh]" size="lg" />;
  if (error || !disaster) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">{error || 'Not found'}</p>
        <Link to="/disasters" className="mt-4 inline-block text-brand-600">← Back to reports</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link to="/disasters" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> Back to reports
      </Link>

      <div className="mt-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{CATEGORY_ICONS[disaster.category]}</span>
          <h1 className="text-2xl font-bold">{disaster.title}</h1>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge severity={disaster.severity} />
          <Badge verified={disaster.verified} />
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium dark:bg-gray-800">
            {disaster.category}
          </span>
        </div>
      </div>

      {disaster.image && (
        <img src={getImageUrl(disaster.image)} alt={disaster.title} className="mt-6 w-full rounded-xl object-cover max-h-96" />
      )}

      <Card className="mt-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{disaster.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{disaster.latitude}, {disaster.longitude}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{formatDate(disaster.createdAt)}</span>
          {disaster.reportedBy?.name && (
            <span className="flex items-center gap-1"><User className="h-4 w-4" />{disaster.reportedBy.name}</span>
          )}
        </div>
      </Card>

      <div className="mt-6">
        <DisasterMap disasters={[disaster]} center={[disaster.latitude, disaster.longitude]} zoom={12} height="350px" />
      </div>
    </div>
  );
}
