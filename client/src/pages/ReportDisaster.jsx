import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, Crosshair } from 'lucide-react';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import DisasterMap from '../components/map/DisasterMap';
import { disasterAPI } from '../services/api';
import { CATEGORIES, SEVERITIES } from '../utils/constants';

export default function ReportDisaster() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'Medium',
    latitude: '',
    longitude: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMapClick = ({ lat, lng }) => {
    setForm({ ...form, latitude: lat.toFixed(6), longitude: lng.toFixed(6) });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        });
      },
      () => setError('Unable to get your location')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.latitude || !form.longitude) {
      setError('Please select a location on the map or use GPS');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (image) formData.append('image', image);

      await disasterAPI.create(formData);
      navigate('/disasters');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const mapCenter = form.latitude && form.longitude
    ? [Number(form.latitude), Number(form.longitude)]
    : [20.5937, 78.9629];

  const markers = form.latitude && form.longitude
    ? [{ _id: 'temp', latitude: Number(form.latitude), longitude: Number(form.longitude), severity: form.severity, title: form.title || 'New Report', category: form.category || 'Flood', description: '', verified: false }]
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Report a Disaster</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Submit a disaster report with location and optional photo
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Card>
          <div className="space-y-4">
            <Input label="Title" required placeholder="Brief title of the disaster" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                required
                rows={4}
                placeholder="Describe what happened..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Category" required placeholder="Select category" options={CATEGORIES} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <Select label="Severity" required options={SEVERITIES} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Location
            </h3>
            <Button type="button" variant="outline" size="sm" onClick={getLocation}>
              <Crosshair className="h-4 w-4" /> Use My Location
            </Button>
          </div>
          <p className="text-sm text-gray-500 mb-3">Click on the map to set the disaster location</p>
          <DisasterMap
            disasters={markers}
            center={mapCenter}
            zoom={form.latitude ? 12 : 5}
            height="350px"
            onMapClick={handleMapClick}
            showSearch
          />
          <div className="mt-3 grid grid-cols-2 gap-4">
            <Input label="Latitude" required readOnly value={form.latitude} placeholder="Click map" />
            <Input label="Longitude" required readOnly value={form.longitude} placeholder="Click map" />
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <Upload className="h-4 w-4" /> Photo (optional)
          </h3>
          <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
          {preview && (
            <img src={preview} alt="Preview" className="mt-3 h-40 rounded-lg object-cover" />
          )}
        </Card>

        <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
          Submit Report
        </Button>
      </form>
    </div>
  );
}
