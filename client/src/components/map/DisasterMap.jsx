import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import Badge from '../ui/Badge';
import MapSearchBar from './MapSearchBar';
import { SEVERITY_COLORS, CATEGORY_ICONS, formatDate, getImageUrl } from '../../utils/constants';

const createIcon = (severity) => {
  const color = SEVERITY_COLORS[severity]?.marker || '#3b82f6';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">⚠</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

function MapViewUpdater({ center, zoom }) {
  const map = useMap();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [center, zoom, map]);

  return null;
}

function MapFlyTo({ target }) {
  const map = useMap();

  useEffect(() => {
    if (!target) return;
    if (target.bounds) {
      map.flyToBounds(target.bounds, { padding: [40, 40], duration: 1.2 });
    } else {
      map.flyTo(target.center, target.zoom || 6, { duration: 1.2 });
    }
  }, [target, map]);

  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng);
    },
  });
  return null;
}

export default function DisasterMap({
  disasters = [],
  center = [20.5937, 78.9629],
  zoom = 5,
  height = '500px',
  onMapClick,
  selectedId,
  onMarkerClick,
  showSearch = false,
}) {
  const [flyTarget, setFlyTarget] = useState(null);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <div
      style={{ height }}
      className="relative w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
    >
      {showSearch && <MapSearchBar onSelect={setFlyTarget} />}
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewUpdater center={center} zoom={zoom} />
        <MapFlyTo target={flyTarget} />
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        {disasters.map((d) => (
          <Marker
            key={d._id}
            position={[d.latitude, d.longitude]}
            icon={createIcon(d.severity)}
            eventHandlers={onMarkerClick ? { click: () => onMarkerClick(d) } : undefined}
            opacity={selectedId && selectedId !== d._id ? 0.5 : 1}
          >
            <Popup>
              <div className="min-w-[200px] space-y-2 p-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{CATEGORY_ICONS[d.category]}</span>
                  <strong className="text-sm">{d.title}</strong>
                </div>
                <div className="flex gap-1">
                  <Badge severity={d.severity} />
                  <Badge verified={d.verified} />
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{d.description}</p>
                {d.image && (
                  <img src={getImageUrl(d.image)} alt={d.title} className="h-24 w-full rounded object-cover" />
                )}
                <p className="text-xs text-gray-400">{formatDate(d.createdAt)}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
