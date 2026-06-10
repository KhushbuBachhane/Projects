export const CATEGORIES = ['Flood', 'Fire', 'Earthquake', 'Accident', 'Storm', 'Landslide'];
export const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

export const SEVERITY_COLORS = {
  Low: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', marker: '#22c55e' },
  Medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-300', marker: '#eab308' },
  High: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', marker: '#f97316' },
  Critical: { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300', marker: '#ef4444' },
};

export const CATEGORY_ICONS = {
  Flood: '🌊',
  Fire: '🔥',
  Earthquake: '🌍',
  Accident: '🚗',
  Storm: '⛈️',
  Landslide: '⛰️',
};

export const API_URL = import.meta.env.VITE_API_URL || '';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
