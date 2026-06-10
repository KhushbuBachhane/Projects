import { Link } from 'react-router-dom';
import { MapPin, Clock, User } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { CATEGORY_ICONS, formatDate, getImageUrl } from '../../utils/constants';

export default function DisasterCard({ disaster, onClick, showActions, actions }) {
  return (
    <Card
      className={`transition-shadow hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
      padding={false}
    >
      <div onClick={onClick} className="p-4">
        {disaster.image && (
          <img
            src={getImageUrl(disaster.image)}
            alt={disaster.title}
            className="mb-3 h-40 w-full rounded-lg object-cover"
          />
        )}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{CATEGORY_ICONS[disaster.category]}</span>
            <h3 className="font-semibold text-gray-900 dark:text-white">{disaster.title}</h3>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge severity={disaster.severity} />
          <Badge verified={disaster.verified} />
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {disaster.category}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {disaster.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {disaster.latitude.toFixed(4)}, {disaster.longitude.toFixed(4)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(disaster.createdAt)}
          </span>
          {disaster.reportedBy?.name && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {disaster.reportedBy.name}
            </span>
          )}
        </div>
      </div>
      {showActions && actions && (
        <div className="flex gap-2 border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          {actions}
        </div>
      )}
    </Card>
  );
}

export function DisasterCardLink({ disaster }) {
  return (
    <Link to={`/disasters/${disaster._id}`}>
      <DisasterCard disaster={disaster} />
    </Link>
  );
}
