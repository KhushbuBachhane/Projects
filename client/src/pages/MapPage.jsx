import { useEffect, useState, useCallback } from 'react';
import { disasterAPI } from '../services/api';
import { connectSocket, getSocket } from '../services/socket';
import DisasterMap from '../components/map/DisasterMap';
import DisasterCard from '../components/disasters/DisasterCard';
import Spinner from '../components/ui/Spinner';

export default function MapPage() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchDisasters = useCallback(async () => {
    try {
      const { data } = await disasterAPI.getAll({ limit: 100 });
      setDisasters(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisasters();
  }, [fetchDisasters]);

  useEffect(() => {
    connectSocket();
    const socket = getSocket();
    const refresh = () => fetchDisasters();

    socket.on('newDisaster', refresh);
    socket.on('disasterUpdated', refresh);
    socket.on('disasterDeleted', refresh);

    return () => {
      socket.off('newDisaster', refresh);
      socket.off('disasterUpdated', refresh);
      socket.off('disasterDeleted', refresh);
    };
  }, [fetchDisasters]);

  if (loading) return <Spinner className="min-h-[60vh]" size="lg" />;

  const mapCenter = selected
    ? [selected.latitude, selected.longitude]
    : disasters.length
      ? [disasters[0].latitude, disasters[0].longitude]
      : [20.5937, 78.9629];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Disaster Map</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        {disasters.length} active reports on the map
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DisasterMap
            disasters={disasters}
            center={mapCenter}
            zoom={selected ? 10 : 5}
            height="600px"
            selectedId={selected?._id}
            onMarkerClick={setSelected}
            showSearch
          />
        </div>
        <div className="max-h-[600px] space-y-3 overflow-y-auto">
          {disasters.map((d) => (
            <DisasterCard
              key={d._id}
              disaster={d}
              onClick={() => setSelected(d)}
            />
          ))}
          {!disasters.length && (
            <p className="text-center text-gray-500 py-10">No disaster reports yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
