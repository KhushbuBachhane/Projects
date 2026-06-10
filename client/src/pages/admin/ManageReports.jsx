import { useEffect, useState } from 'react';
import { CheckCircle, Trash2, AlertCircle } from 'lucide-react';
import { disasterAPI } from '../../services/api';
import DisasterCard from '../../components/disasters/DisasterCard';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';
import { SEVERITIES } from '../../utils/constants';

export default function ManageReports() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (filter === 'verified') params.verified = 'true';
      if (filter === 'unverified') params.verified = 'false';
      const { data } = await disasterAPI.getAll(params);
      setDisasters(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, [filter]);

  const handleVerify = async (id) => {
    await disasterAPI.verify(id);
    fetchReports();
  };

  const handleSeverity = async (id, severity) => {
    await disasterAPI.updateSeverity(id, severity);
    fetchReports();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this report?')) return;
    await disasterAPI.delete(id);
    fetchReports();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Manage Reports</h1>

      <div className="mt-4 flex gap-2">
        {['all', 'unverified', 'verified'].map((f) => (
          <Button key={f} variant={filter === f ? 'primary' : 'outline'} size="sm" onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {loading ? (
        <Spinner className="py-20" size="lg" />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {disasters.map((d) => (
            <DisasterCard
              key={d._id}
              disaster={d}
              showActions
              actions={
                <>
                  {!d.verified && (
                    <Button size="sm" onClick={() => handleVerify(d._id)}>
                      <CheckCircle className="h-4 w-4" /> Verify
                    </Button>
                  )}
                  <Select
                    options={SEVERITIES}
                    value={d.severity}
                    onChange={(e) => handleSeverity(d._id, e.target.value)}
                    className="!py-1 text-xs"
                  />
                  <Button size="sm" variant="danger" onClick={() => handleDelete(d._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
